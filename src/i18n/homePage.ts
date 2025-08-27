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
        `Πιστεύω πως η θεραπευτική σχέση είναι θεμελιώδης στην διαδικασία της επούλωσης. Δημιουργώντας ένα ασφαλές, υποστηρικτικό περιβάλλον, όπου οι θεραπευόμενοι νιώθουν ότι ακούγονται και συνδέονται αυθεντικά, τους δίνει τον “χώρο” να εξερευνήσουν, να θεραπευτούν και να εξελιχθούν. Η προσέγγισή μου είναι εμπνευσμένη από τη Ψυχοδυναμική, την Προσωποκεντρική, την Υπαρξιακή, την Γκεστάλτ και την Γνωσιακή-Συμπεριφορική Θεραπεία, όπου προσαρμόζεται με σεβασμό στις ιδιαίτερες ανάγκες του κάθε ανθρώπου. Είτε αντιμετωπίζεις μια παρούσα δυσκολία είτε θέλεις να εμβαθύνεις στα εσωτερικά σου βιώματα, η θεραπεία είναι ένας χώρος για να αφουγκραστείς και να επανασυνδεθείς με τον εαυτό σου.`,
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
      intro: `Προσφέρω ατομικές ψυχοθεραπευτικές συνεδρίες εξ αποστάσεως (online) για ενήλικες που αναζητούν στήριξη, κατανόηση και προσωπική εξέλιξη.
Συνεργάζομαι με ανθρώπους από διαφορετικά πολιτισμικά και κοινωνικά υπόβαθρα, ανεξαρτήτως ηλικίας, εθνικότητας, φύλου ή σεξουαλικού προσανατολισμού. Ο καθένας φέρει τη δική του μοναδική ιστορία, και αυτός είναι ένας χώρος όπου μπορεί να την μοιραστεί.`,
      list: [
        { title: "Άγχος, υπερανάλυση, κρίσεις πανικού", text: "Το άγχος, η υπερανάλυση και οι κρίσεις πανικού μπορούν να είναι εξουθενωτικά και να επηρεάζουν τη διάθεση, τη δουλειά, ακόμα και τις προσωπικές σχέσεις. Στις έντονες στιγμές άγχους και ξαφνικά, μπορεί να εμφανιστούν κρίσεις πανικού προκαλώντας σωματικά και συναισθηματικά συμπτώματα. " },
        { title: "Συναισθηματική ρύθμιση και δυσκολίες στην αναγνώριση συναισθημάτων", text: "Η δυσκολία να αναγνωρίσει και να εκφράσει κανείς τα συναισθήματά του με υγιή τρόπο μπορεί να οδηγήσει σε αίσθημα αναστάτωσης ή ακόμη και σύγχυσης (άγχος, θυμός, φόβος, λύπη, ντροπή, ζήλια, ενοχή, απογοήτευση)." },
        { title: "Τραύματα ή συναισθηματικά φορτισμένες εμπειρίες", text: "Οι τραυματικές εμπειρίες  συχνά αφήνουν συναισθηματικά αποτυπώματα που επηρεάζουν την καθημερινότητα και τις σχέσεις με τους άλλους." },
        { title: "Καταθλιπτική διάθεση", text: "Η κατάθλιψη επηρεάζει τη διάθεση, την ενέργεια και τη γενική ποιότητα της ζωής." },
        { title: "Αναβλητικότητα, φόβος αποτυχίας, δυσκολία στη λήψη αποφάσεων", text: "Ο φόβος της αποτυχίας ή οι ανασφάλειες μπορεί να γίνουν εμπόδιο από το να προχωρήσουμε μπροστά και να πετύχουμε τους στόχους μας. Η αναβλητικότητα συχνά προκύπτει από αυτή την εσωτερική σύγκρουση και μπορεί να δημιουργήσει έναν φαύλο κύκλο." },
        { title: "Επαγγελματικό άγχος, εξουθένωση (burnout)", text: "Η συνεχής πίεση στον επαγγελματικό χώρο, οι υπερβολικές ώρες εργασίας και οι συγκρούσεις με συναδέλφους ή προϊσταμένους μπορεί να οδηγήσουν σε εξουθένωση (burnout)." },
        { title: "Χαμηλή αυτοεκτίμηση και θέματα εικόνας εαυτού", text: "Τα θέματα εικόνας εαυτού επηρεάζουν όχι μόνο την προσωπική ευημερία, αλλά και τις σχέσεις με τους άλλους." },
        { title: "Διερεύνηση ταυτότητας, με ιδιαίτερη στήριξη προς την LGBTQ+ κοινότητα", text: "Η αναζήτηση ταυτότητας και η ανάγκη για αποδοχή είναι θεμελιώδη στοιχεία της ανθρώπινης ύπαρξης. Για τα μέλη της LGBTQ+ κοινότητας, αυτή η διαδικασία μπορεί να είναι μια ιδιαίτερη πρόκληση, λόγω κοινωνικών πιέσεων και προκαταλήψεων." },
        { title: "Ζητήματα σχέσεων (προσωπικών, φιλικών, οικογενειακών, επαγγελματικών)", text: "Οι σχέσεις που δεν λειτουργούν όπως θα θέλαμε, μπορούν να προκαλέσουν άγχος, σύγχυση και συναισθηματική φόρτιση." },
        { title: "Μεταβάσεις ζωής, υπαρξιακά ερωτήματα, αναζήτηση νοήματος", text: "Οι μεγάλες αλλαγές στη ζωή μας, όπως η αλλαγή καριέρας, ο θάνατος ενός αγαπημένου προσώπου ή η μετάβαση από μια φάση ζωής στην άλλη, μπορεί να μας προκαλέσουν ερωτήματα για το ποιο είναι το νόημα της ζωής μας και ποια είναι η κατεύθυνσή μας." },
        { title: "Διατροφικές διαταραχές και ανησυχίες εικόνας του σώματος", text: "Οι διατροφικές διαταραχές είναι σοβαρές ψυχολογικές καταστάσεις που επηρεάζουν την υγεία, την ψυχική ευημερία και τη συνολική ποιότητα ζωής. Οι πιο κοινές διατροφικές διαταραχές περιλαμβάνουν τα υπερφαγικά επεισόδια την βουλιμία και την ανορεξία." },
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
      text: `I believe that the therapeutic relationship is fundamental to the healing process. Creating a safe, supportive environment where clients feel heard and genuinely connected allows them the space to explore, heal, and grow. My approach is inspired by Psychodynamic, Person-Centered, Existential, Gestalt, and Cognitive-Behavioral Therapy, and is adapted with respect to each person’s unique needs. Whether you are facing a present difficulty or wish to delve deeper into your inner experiences, therapy is a space to listen and reconnect with yourself.`,
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
      intro: `I offer individual online psychotherapy sessions for adults seeking support, understanding, and personal growth.
I work with people from diverse cultural and social backgrounds, regardless of age, nationality, gender, or sexual orientation. Each person brings their own unique story—and this is a safe space to share it.`,
      list: [
        { title: "Anxiety, overthinking, panic attacks", text: "Anxiety, overthinking, and panic attacks can be exhausting and affect mood, work, and even personal relationships. In moments of intense stress and suddenly, panic attacks may occur, causing physical and emotional symptoms." },
        { title: "Emotional regulation and difficulties in recognizing emotions", text: "The difficulty of recognizing and expressing one’s emotions in a healthy way can lead to feelings of distress or even confusion (anxiety, anger, fear, sadness, shame, jealousy, guilt, disappointment)." },
        { title: "Trauma or emotionally charged experiences", text: "Traumatic experiences often leave emotional imprints that affect daily life and relationships with others." },
        { title: "Depressive mood", text: "Depression affects mood, energy, and overall quality of life." },
        { title: "Procrastination, fear of failure, difficulty making decisions", text: "The fear of failure or insecurities can become obstacles that prevent us from moving forward and achieving our goals. Procrastination often arises from this inner conflict and can create a vicious cycle." },
        { title: "Work-related stress, burnout", text: "Constant pressure in the workplace, excessive working hours, and conflicts with colleagues or supervisors can lead to burnout." },
        { title: "Low self-esteem and self-image issues", text: "Self-image issues affect not only personal well-being but also relationships with others." },
        { title: "Exploring identity, with particular support for the LGBTQ+ community", text: "The search for identity and the need for acceptance are fundamental aspects of human existence. For members of the LGBTQ+ community, this process can be a particular challenge due to social pressures and prejudices." },
        { title: "Relationship issues (personal, friendships, family, professional)", text: "Relationships that do not function as we wish can cause stress, confusion, and emotional strain." },
        { title: "Life transitions, existential questions, search for meaning", text: "Major life changes, such as a career shift, the loss of a loved one, or the transition from one stage of life to another, may lead us to question the meaning of our lives and our direction." },
        { title: "Eating disorders and body image concerns", text: "Eating disorders are serious psychological conditions that affect health, mental well-being, and overall quality of life. The most common eating disorders include binge eating, bulimia, and anorexia." },
      ]
    }
  }
} as const;
export default homePage;