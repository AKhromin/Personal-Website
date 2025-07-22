import React, { useRef } from 'react';
import emailjs from 'emailjs-com';
import { toast } from 'react-toastify';

const Contact = React.forwardRef((props, ref) => {
  const form = useRef();

  const toastConfig = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm('service_zq1eerv', 'template_g1xeycw', form.current, 'R0izA26l_3RiWsCEU')
      .then((result) => {
        console.log(result.text);
        form.current.reset();
        toast.success('Email sent successfully!', toastConfig);
      }, (error) => {
        console.log(error.text);
        toast.error('Failed to send email. Please try again.', toastConfig);
      });
  };

  return (
    <section id="contactSection" ref={ref}>
      <div className="contact-content">
        <div className="contactText">
          <h2>Contact</h2>
        </div>
        <form ref={form} onSubmit={sendEmail}>
          <label>Your Email</label>
          <input type="email" name="user_email" required />
          <label>Message</label>
          <textarea name="message" required />
          <button type="submit">Send</button>
        </form>
      </div>
    </section>
  );
});

export default Contact;
