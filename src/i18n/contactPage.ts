const contactPage = {
  en: {
    pageTitle: "Contact",
    intro: "Have a question or want to book? Send a message and I’ll get back to you.",
    form: {
      name: "Full name",
      email: "Email",
      phone: "Phone (optional)",
      subject: "Subject",
      message: "Your message",
      submit: "Send message",
      sending: "Sending…",
      successTitle: "Message sent",
      successBody: "Thank you for your message. I’ll reply as soon as possible.",
      errorTitle: "Something went wrong",
      errorBody: "Please try again or use one of the options below."
    },
    otherWays: {
      title: "Other ways to reach me",
      subtitle: "If you prefer, use any of the following:",
      viber: "Viber",
      whatsapp: "WhatsApp",
      telegram: "Telegram",
      email: "Email",
      call: "Call"
    }
  },
  el: {
    pageTitle: "Επικοινωνία",
    intro: "Έχετε ερώτηση ή θέλετε να κλείσετε ραντεβού; Στείλτε μήνυμα και θα απαντήσω σύντομα.",
    form: {
      name: "Ονοματεπώνυμο",
      email: "Email",
      phone: "Τηλέφωνο (προαιρετικό)",
      subject: "Θέμα",
      message: "Μήνυμα",
      submit: "Αποστολή",
      sending: "Αποστολή…",
      successTitle: "Το μήνυμα στάλθηκε",
      successBody: "Ευχαριστώ για την επικοινωνία. Θα απαντήσω το συντομότερο.",
      errorTitle: "Κάτι πήγε στραβά",
      errorBody: "Δοκιμάστε ξανά ή χρησιμοποιήστε μία από τις παρακάτω επιλογές."
    },
    otherWays: {
      title: "Άλλοι τρόποι επικοινωνίας",
      subtitle: "Αν προτιμάτε, χρησιμοποιήστε έναν από τους παρακάτω:",
      viber: "Viber",
      whatsapp: "WhatsApp",
      telegram: "Telegram",
      email: "Email",
      call: "Κλήση"
    }
  }
} as const;
export default contactPage;