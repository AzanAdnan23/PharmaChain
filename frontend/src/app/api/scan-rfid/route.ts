// app/api/scan-rfid/route.js
import { SerialPort } from 'serialport';

export async function GET() {
  const portName = 'COM10'; // Update this as needed
  const baudRate = 115200;
  
  const port = new SerialPort({
    path: portName,
    baudRate: baudRate,
    autoOpen: false
  });

  const hexCommand = Buffer.from('53570006FF0100000050', 'hex');
  
  return new Promise((resolve) => {
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
          console.log('Card ID:', responseHex);
          port.close((closeErr) => {
            if (closeErr) {
              console.error('Error closing port: ', closeErr.message);
            }
            resolve(new Response(responseHex));
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