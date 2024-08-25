import { SerialPort } from 'serialport';

export async function GET(): Promise<Response> {
  const portName = 'COM5'; // Update this as needed
  const baudRate = 115200;
  
  const port = new SerialPort({
    path: portName,
    baudRate: baudRate,
    autoOpen: false
  });

  const hexCommand = Buffer.from('53570006FF0100000050', 'hex');
  
  return new Promise<Response>((resolve) => {  // Explicitly set the type of the promise
    port.open((err) => {
      if (err) {
        return resolve(new Response('Error opening port: ' + err.message, { status: 500 }));
      }

      let validIdFound = false;

      const processResponse = (data: any) => {
        const responseHex = data.toString('hex');
        if (responseHex === '4354000400010064') {
          console.log('No card scanned');
        } else {
          validIdFound = true;
          let last32Bytes = responseHex.slice(-32); // Extract the last 32 hex characters
          
          // Ensure the last32Bytes is exactly 32 bytes long by padding with zeros if needed
          last32Bytes = last32Bytes.padStart(64, '0');
          const bytes32Data0x = '0x' + last32Bytes;
          
          console.log('Card ID (bytes32):', bytes32Data0x);
          port.close((closeErr) => {
            if (closeErr) {
              console.error('Error closing port: ', closeErr.message);
            }
            resolve(new Response(bytes32Data0x));
          });
        }
      };

      port.on('data', processResponse);
      const sendCommand = () => {
        if (!validIdFound) {
          port.write(hexCommand, (writeErr) => {
            if (writeErr) {
              console.error('Error on write: ', writeErr.message);
            }
          });
        }
      };

      const intervalId = setInterval(() => {
        if (validIdFound) {
          clearInterval(intervalId);
        } else {
          sendCommand();
        }
      }, 1000);
    });
  });
}
