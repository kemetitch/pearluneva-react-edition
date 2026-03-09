import { useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import AnimateOnScroll from "../components/ui/AnimateOnScroll";

export default function ContactPage() {
  const { showToast } = useToast();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Contact form submitted:", form);
    setSubmitted(true);
    showToast("Message sent successfully!", "✅");

    setTimeout(() => {
      setForm({ name: "", phone: "", email: "", message: "" });
      setSubmitted(false);
    }, 5000);
  };

  return (
    <>
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <h1 className="page-header__title">Contact Us</h1>
          <div className="section-divider"></div>
          <nav className="page-header__breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>Contact</span>
          </nav>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section contact-section">
        <div className="container">
          <div className="contact__grid">
            {/* Contact Info */}
            <AnimateOnScroll className="contact__info">
              <h2 className="contact__info-title">
                Let's Create Something Together
              </h2>
              <p className="contact__info-text">
                Whether you have a question about our products, want to place a
                custom order, or just want to say hello — we'd love to hear from
                you. Our team typically responds within 24 hours.
              </p>

              <div className="contact__details">
                <div className="contact__detail-item">
                  <div className="contact__detail-icon">📍</div>
                  <div className="contact__detail-info">
                    <h4>Our Studio</h4>
                    <p>Al Mokatam, Cairo, Egypt</p>
                  </div>
                </div>
                <div className="contact__detail-item">
                  <div className="contact__detail-icon">📞</div>
                  <div className="contact__detail-info">
                    <h4>Phone</h4>
                    <p>0100-8925-664</p>
                  </div>
                </div>
                <div className="contact__detail-item">
                  <div className="contact__detail-icon">✉️</div>
                  <div className="contact__detail-info">
                    <h4>Email</h4>
                    <p>hello@pearluneva.com</p>
                  </div>
                </div>
                <div className="contact__detail-item">
                  <div className="contact__detail-icon">🕐</div>
                  <div className="contact__detail-info">
                    <h4>Working Hours</h4>
                    <p>Sat – Thu: 9:00 AM – 9:00 PM</p>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>

            {/* Contact Form */}
            <AnimateOnScroll className="contact__form">
              <h3 className="contact__form-title">Send Us a Message</h3>
              {!submitted ? (
                <form id="contact-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="contact-name">Your Name</label>
                    <input
                      type="text"
                      id="contact-name"
                      placeholder="Enter your full name"
                      required
                      value={form.name}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, name: e.target.value }))
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="contact-phone">Phone Number</label>
                    <input
                      type="tel"
                      id="contact-phone"
                      placeholder="Enter your phone number"
                      required
                      value={form.phone}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, phone: e.target.value }))
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="contact-email">Email Address</label>
                    <input
                      type="email"
                      id="contact-email"
                      placeholder="Enter your email address"
                      value={form.email}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, email: e.target.value }))
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="contact-message">Your Message</label>
                    <textarea
                      id="contact-message"
                      placeholder="Write your message here..."
                      rows="5"
                      required
                      value={form.message}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, message: e.target.value }))
                      }
                    ></textarea>
                  </div>
                  <button type="submit" className="btn btn--primary w-100">
                    Send Message →
                  </button>
                </form>
              ) : (
                <div className="form-success show">
                  <div className="form-success__icon">✅</div>
                  <h3 className="form-success__title">Message Sent!</h3>
                  <p className="form-success__text">
                    Thank you for reaching out. We'll get back to you within 24
                    hours.
                  </p>
                </div>
              )}
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section cta-section">
        <div className="container">
          <AnimateOnScroll as="h2" className="section-title">
            Follow Our Journey
          </AnimateOnScroll>
          <AnimateOnScroll className="section-divider" />
          <AnimateOnScroll as="p" className="section-subtitle">
            Stay connected with us on social media for behind-the-scenes looks,
            new product launches, and crafting inspiration.
          </AnimateOnScroll>
          <AnimateOnScroll className="text-center d-flex gap-md flex-center flex-wrap">
            <a
              href="https://www.instagram.com/thepearluneva?igsh=bWZpdjRybDVmcDBm"
              className="btn btn--accent"
              target="_blank"
              rel="noreferrer"
            >
              📷 Instagram
            </a>
            <a
              href="https://www.tiktok.com/@pearluneva"
              className="btn hero__btn-secondary"
              target="_blank"
              rel="noreferrer"
            >
              🎵 TikTok
            </a>
            <a
              href="https://wa.me/2001008925664"
              className="btn hero__btn-secondary"
              target="_blank"
              rel="noreferrer"
            >
              💬 WhatsApp
            </a>
          </AnimateOnScroll>
        </div>
      </section>
    </>
  );
}
