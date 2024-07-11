import serial

# Define the serial port and baud rate
SERIAL_PORT = 'COM10'  # Update this to your serial port
BAUD_RATE = 115200

# Commands
SET_WORK_MODE = bytes.fromhex('53 57 00 05 FF 24 02 00 2C')
SET_INTERFACE_RS232 = bytes.fromhex('53 57 00 05 FF 24 01 01 2C')
SET_INQUIRY_AREA_TID = bytes.fromhex('53 57 00 05 FF 24 0A 01 1F')
READ_TAG_ID = bytes.fromhex('53 57 00 03 FF 01 53')

def calculate_checksum(data):
    checksum = 0
    for byte in data:
        checksum += byte
    checksum = (~checksum + 1) & 0xFF
    return checksum

def verify_checksum(response):
    if len(response) < 2:
        return False
    data = response[:-1]  # Exclude the last byte which is the checksum
    checksum = response[-1]
    calculated_checksum = calculate_checksum(data)
    return calculated_checksum == checksum

def send_command(serial_port, command):
    serial_port.write(command)
    response = serial_port.read(26)  # Read up to 26 bytes
    if len(response) > 0 and verify_checksum(response):
        return response
    else:
        raise ValueError("Invalid or incomplete response")

def extract_tag_id(response):
    if len(response) < 24:
        raise ValueError("Response too short to contain a valid TagID")
    tag_id = response[12:24]  # Assuming the TagID is 12 bytes long
    return tag_id.hex()

def main():
    try:
        with serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=1) as ser:
            # Set work mode to answer mode
            send_command(ser, SET_WORK_MODE)
            
            # Set interface to RS232
            send_command(ser, SET_INTERFACE_RS232)
            
            # Set inquiry area to TID
            send_command(ser, SET_INQUIRY_AREA_TID)
            
            # Read TagID
            response = send_command(ser, READ_TAG_ID)
            
            # Extract and display the TagID
            tag_id = extract_tag_id(response)
            print(f"TagID: {tag_id}")

    except serial.SerialException as e:
        print(f"Serial error: {e}")
    except ValueError as e:
        print(f"Value error: {e}")
    except Exception as e:
        print(f"Unexpected error: {e}")

if __name__ == "__main__":
    main()
