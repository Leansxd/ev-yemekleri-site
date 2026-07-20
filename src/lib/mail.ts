import nodemailer from 'nodemailer';

export async function sendReservationAlert(reservation: {
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: string;
  hasShuttle: boolean;
}) {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  
  const recipient = 'evrestaurantalanya@gmail.com';

  console.log(`[Email Alert Simulation] Yeni Rezervasyon Alındı:`, reservation);

  if (!user || !pass) {
    console.log('[Email Alert] SMTP kimlik bilgileri eksik (.env dosyasında SMTP_USER ve SMTP_PASS ayarlanmalı). E-posta gönderimi simüle edildi.');
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    const shuttleText = reservation.hasShuttle 
      ? 'Evet, VIP Shuttle Araç Servisi Talep Edildi' 
      : 'Hayır, Araç Servisi İstenmiyor';

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #c69b52; border-radius: 8px; padding: 20px; background-color: #0b0b0b; color: #ffffff;">
        <h2 style="color: #c69b52; text-align: center; border-bottom: 1px solid #c69b52; padding-bottom: 10px;">Ev Restaurant - Yeni Rezervasyon Talebi</h2>
        <p>Sayın Ev Restaurant Yöneticisi,</p>
        <p>Siteniz üzerinden yeni bir masa rezervasyonu oluşturuldu. Detaylar aşağıdadır:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #222; color: #c69b52; font-weight: bold; width: 150px;">Müşteri Adı:</td>
            <td style="padding: 8px; border-bottom: 1px solid #222; color: #ffffff;">${reservation.name}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #222; color: #c69b52; font-weight: bold;">Telefon:</td>
            <td style="padding: 8px; border-bottom: 1px solid #222; color: #ffffff;">${reservation.phone}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #222; color: #c69b52; font-weight: bold;">Tarih:</td>
            <td style="padding: 8px; border-bottom: 1px solid #222; color: #ffffff;">${reservation.date}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #222; color: #c69b52; font-weight: bold;">Saat:</td>
            <td style="padding: 8px; border-bottom: 1px solid #222; color: #ffffff;">${reservation.time}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #222; color: #c69b52; font-weight: bold;">Koltuk & Kişi:</td>
            <td style="padding: 8px; border-bottom: 1px solid #222; color: #ffffff;">${reservation.guests}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #222; color: #c69b52; font-weight: bold;">Araçla Alma:</td>
            <td style="padding: 8px; border-bottom: 1px solid #222; color: #c69b52; font-weight: bold;">${shuttleText}</td>
          </tr>
        </table>
        
        <p style="margin-top: 20px; text-align: center;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin" style="background-color: #c69b52; color: #000000; padding: 10px 20px; border-radius: 4px; text-decoration: none; font-weight: bold; display: inline-block;">
            Admin Paneline Git
          </a>
        </p>
        <hr style="border: 0; border-top: 1px solid #222; margin-top: 20px;" />
        <p style="font-size: 0.8rem; color: #666; text-align: center;">Bu e-posta Ev Restaurant Otomatik Rezervasyon Sistemi tarafından gönderilmiştir.</p>
      </div>
    `;

    await transporter.sendMail({
      from: `"Ev Restaurant Otomasyonu" <${user}>`,
      to: recipient,
      subject: `🚨 Yeni Rezervasyon Talebi: ${reservation.name} - ${reservation.guests}`,
      html: htmlContent,
    });
    console.log(`[Email Alert] Bildirim e-postası başarıyla gönderildi: ${recipient}`);
  } catch (err) {
    console.error(`[Email Alert Error] E-posta gönderimi başarısız:`, err);
  }
}
