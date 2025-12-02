import QRCode from 'qrcode';

const generatePaymentQR = async (amount, upiId) => {
    try {
        const upiString = `upi://pay?pa=${upiId}&pn=HOSTIA&am=${amount}&cu=INR`;
        const qrCodeDataURL = await QRCode.toDataURL(upiString, {
            width: 300,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            }
        });
        return qrCodeDataURL;
    } catch (error) {
        console.error('Error generating QR code:', error);
        throw error;
    }
};

export { generatePaymentQR };
