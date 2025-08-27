export const homePage = {
  el: {
    hero: {
      title: 'Ψυχική Υγεία ♡ Ψυχοθεραπεία',
      subtitle: '“Από την ψυχή για την ψυχή”',
      note: 'Συνεδρίες δια ζώσης¹ & Online'
    },
    spotlight: {
      title: "Προσέγγιση",
      text:
        "Πιστεύω στην ασφαλή, ζεστή και ειλικρινή θεραπευτική σχέση. Προσφέρω ατομικές ψυχοθεραπευτικές συνεδρίες για ενήλικες που αναζητούν στήριξη, κατανόηση και προσωπική εξέλιξη. Η προσέγγισή μου είναι εμπνευσμένη από τη ψυχοδυναμική, την προσωποκεντρική, την υπαρξιακή, την Gestalt και την γνωσιακή-συμπεριφορική θεραπεία, όπου προσαρμόζεται με σεβασμό στις ιδιαίτερες ανάγκες του κάθε ανθρώπου. Είτε αντιμετωπίζεις μια παρούσα δυσκολία είτε θέλεις να εμβαθύνεις στα εσωτερικά σου βιώματα, η θεραπεία είναι ένας χώρος για να αφουγκραστείς και να επανασυνδεθείς με τον εαυτό σου.",
      authorName: "Δήμητρα Μαλάκη",
      authorRole: "Σύμβουλος Ψυχικής Υγείας",
      photoAlt: "Φωτογραφία",
    },
    sessions: {
      title: "Συνεδρίες",
      subtitle: "Δια ζώσης¹ & Online συνεδρίες",
      online: {
        title: "Online επιλογές",
        note: "Επικοινώνησε μέσω των παρακάτω πλατφορμών:",
        services: [
          {
            key: "viber",
            label: "Viber",
            helper: "Κλήση ή μήνυμα",
            href: "viber://chat?number=%2B306940340777",
            aria: "Άνοιγμα Viber",
          },
          {
            key: "whatsapp",
            label: "WhatsApp",
            helper: "Κλήση ή μήνυμα",
            href: "https://wa.me/306940340777",
            aria: "Άνοιγμα WhatsApp",
          },
          {
            key: "teams",
            label: "Microsoft Teams",
            helper: "κατόπιν συνεννόησης",
            href: "https://teams.microsoft.com/l/chat/0/0?users=malaki.dimitra@gmail.com",
            aria: "Άνοιγμα Microsoft Teams",
          },
          {
            key: "meet",
            label: "Google Meet",
            helper: "κατόπιν συνεννόησης",
            href: "",
            aria: "Άνοιγμα Google Meets",
          },
        ],
      },
      inPerson: {
        title: "Δια ζώσης",
        subtitle: "Συνεδρίες στη Θεσσαλονίκη (με ραντεβού)",
        addressLabel: "Διεύθυνση:",
        address: "Καλαμαριά Θεσσαλονίκης (ακριβής τοποθεσία με ραντεβού)",
        points: [
          "Ήσυχος, ασφαλής και φιλόξενος χώρος",
          "Ευκολία πρόσβασης με ΜΜΜ (και για ΑΜΕΑ, 50μ στάση λεωφορείου, 500μ μετρό)",
          "Δυνατότητα πρωινών και απογευματινών ραντεβού",
        ],
      },
      duration: {
        title: "Διάρκεια & Κόστος",
        items: [
          { label: "Ατομική συνεδρία (online)", length: "50′", fee: "30 €" },
          { label: "Ατομική συνεδρία (δια ζώσης)", length: "50′", fee: "38 €" },
          { label: "Πρώτη γνωριμία", length: "15'", fee: "Δωρεάν" },
        ],
        note: "Παρέχεται απόδειξη. Φοιτητική τιμολόγηση κατόπιν συνεννόησης.",
      },
    },
    services: {
      title: 'Υπηρεσίες',
      intro: 'Συνεργάζομαι με ανθρώπους από διαφορετικά πολιτισμικά και κοινωνικά υπόβαθρα, ανεξαρτήτως ηλικίας, εθνικότητας, φύλου ή σεξουαλικού προσανατολισμού. Ο καθένας φέρει τη δική του μοναδική ιστορία, και αυτός είναι ένας χώρος όπου μπορεί να την εκφράσει χωρίς φόβο και χωρίς κριτική.',
      list: [
        { title: "Άγχος, υπερανάλυση, συναισθηματική υπερένταση", text: "κρίσεις πανικού" },
        { title: "Συναισθηματική ρύθμιση", text: "δυσκολίες στην επεξεργασία συναισθημάτων και στη διαχείρηση (άγχος, θυμός, φόβος, λύπη, ντροπή, ζήλεια, ενοχή, απογοήτευση)" },
        { title: "Διατροφικές διαταραχές", text: "υπερφαγικά επεισόδια, βουλιμία, ανορεξία" },
        { title: "Διαταραχές προσωπικότητας", text: "χρόνιες και δυσλειτουργικές συμπεριφορές" },
        { title: "Τραύματα ή συναισθηματικά φορτισμένες εμπειρίες", text: "τραυματικές εμπειρίες και συναισθηματικά αποτυπώματα" },
        { title: "Αναβλητικότητα, φόβος αποτυχίας, δυσκολία στη λήψη αποφάσεων", text: "εσωτερική σύγκρουση" },
        { title: "Καταθλιπτική διάθεση / κατάθλιψη", text: "κατανόηση των αιτιών, ανάπτυξη στρατηγικών" },
        { title: "Επαγγελματικό άγχος", text: "εξουθένωση (burnout), συγκρούσεις στο χώρο εργασίας" },
        { title: "Χαμηλή αυτοεκτίμηση", text: "θέματα εικόνας εαυτού" },
        { title: "Διερεύνηση ταυτότητας", text: "Διερεύνηση ταυτότητας και ανάγκης για ανήκειν, με ιδιαίτερη στήριξη προς την LGBTQ+ κοινότητα" },
        { title: "Ζητήματα σχέσεων", text: "προσωπικών, φιλικών, οικογενειακών, επαγγελματικών, τοξικών" },
        { title: "Μεταβάσεις ζωής", text: "υπαρξιακά ερωτήματα, αναζήτηση νοήματος" },
      ]
    }
  },
  en: {
    hero: {
      title: 'Mental Health ♡ Psychotherapy',
      subtitle: '“From soul to soul”',
      note: 'In-person¹ & Online Sessions'
    },
    spotlight: {
      title: "Approach",
      text: "I believe in a safe, warm, and genuine therapeutic relationship. I offer individual psychotherapy sessions for adults seeking support, understanding, and personal growth. My approach is inspired by psychodynamic, person-centered, existential, Gestalt, and cognitive-behavioral therapy, and is adapted with respect to each person’s unique needs. Whether you are facing a present difficulty or wish to delve deeper into your inner experiences, therapy is a space to listen and reconnect with yourself.",
      authorName: "Dimitra Malaki",
      authorRole: "Mental Health Counselor",
      photoAlt: "Counselor portrait",
    },
    sessions: {
      title: "Sessions",
      subtitle: "In-person¹ & Online Sessions",
      online: {
        title: "Online options",
        note: "Reach out via any of the platforms below:",
        services: [
          {
            key: "viber",
            label: "Viber",
            helper: "Call or message",
            href: "viber://chat?number=%2B306940340777",
            aria: "Open Viber",
          },
          {
            key: "whatsapp",
            label: "WhatsApp",
            helper: "Call or message",
            href: "https://wa.me/306940340777",
            aria: "Open WhatsApp",
          },
          {
            key: "teams",
            label: "Microsoft Teams",
            helper: "Upon request",
            href: "#",
            aria: "Open Microsoft Teams",
          },
          {
            key: "meet",
            label: "Google Meet",
            helper: "Upon request",
            href: "#",
            aria: "Open Google Meet",
          },
        ],
      },
      inPerson: {
        title: "In-person",
        subtitle: "Sessions in Thessaloniki (by appointment)",
        addressLabel: "Address:",
        address: "Kalamaria - Thessaloniki suburbs (exact location with appointment)",
        points: [
          "Quiet, safe, and welcoming environment",
          "Easy access via public transport (50m bus stop, 500m metro)",
          "Morning and afternoon appointments available",
        ],
      },
      duration: {
        title: "Duration & Fees",
        items: [
          { label: "Individual session (online)", length: "50′", fee: "30 €" },
          { label: "Individual session (in-person)", length: "50′", fee: "38 €" },
          { label: "Introductory meeting", length: "15'", fee: "FREE" },
        ],
        note: "Receipt provided. Student pricing available upon request.",
      },
    },
    services: {
      title: 'Services',
      intro: 'I work with people from diverse cultural and social backgrounds, regardless of age, nationality, gender, or sexual orientation. Everyone carries their own unique story, and this is a space where they can share it without fear or judgment.',
      list: [
        { title: "Anxiety, Overthinking, Emotional Overload", text: "panic attacks" },
        { title: "Emotional Regulation", text: "difficulties processing and managing emotions (anxiety, anger, fear, sadness, shame, jealousy, guilt, disappointment)" },
        { title: "Eating Disorders", text: "binge eating episodes, bulimia, anorexia" },
        { title: "Personality Disorders", text: "chronic and maladaptive behavior patterns" },
        { title: "Trauma or Emotionally Charged Experiences", text: "traumatic events and emotional imprints" },
        { title: "Procrastination, Fear of Failure, Difficulty Making Decisions", text: "inner conflict" },
        { title: "Depressed Mood / Depression", text: "understanding root causes, developing coping strategies" },
        { title: "Work-Related Stress", text: "burnout, workplace conflicts" },
        { title: "Low Self-Esteem", text: "self-image issues" },
        { title: "Identity Exploration", text: "exploring identity and the need to belong, with particular support for the LGBTQ+ community" },
        { title: "Relationship Challenges", text: "personal, friendships, family, workplace, toxic relationships" },
        { title: "Life Transitions", text: "existential questions, search for meaning" },
      ]
    }
  }
} as const;
export default homePage;