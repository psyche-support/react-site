export const sessionsPage = {
  el: {
    sessionsPage: {
      title: "Συνεδρίες",
      lead: {
        title: "Κλείσε την πρώτη θεραπευτική συνεδρία",
        text:
          "Ξεκινήστε την πρώτη online/δια ζώσης συνεδρία στο psyche.support. Οι εξ αποστάσεως συνεδρίες πραγματοποιούνται μέσω Viber, Whatsapp, Microsoft Teams και Google Meet.",
        bookCta: "Κλείσε ραντεβού εδώ",
        bookHref: "https://cal.com/psyche-support", // αντικαταστήστε
      },
      /* Optional: use your existing icon link set */
      online: {
        services: [
          { key: "viber", label: "Viber", helper: "Κλήση ή μήνυμα", href: "viber://chat?number=%2B3069XXXXXXXX", aria: "Άνοιγμα Viber" },
          { key: "whatsapp", label: "WhatsApp", helper: "Κλήση ή μήνυμα", href: "https://wa.me/3069XXXXXXXXX", aria: "Άνοιγμα WhatsApp" },
          { key: "teams", label: "Microsoft Teams", helper: "Σύνδεσμος συνεδρίας", href: "https://teams.microsoft.com/l/meetup-join/...", aria: "Άνοιγμα Microsoft Teams" },
          { key: "meet", label: "Google Meet", helper: "Σύνδεσμος συνεδρίας", href: "https://meet.google.com/your-code", aria: "Άνοιγμα Google Meet" }
        ]
      },
      sections: [
        {
          title: "Τι είναι η ψυχοθεραπεία",
          paragraphs: [
            "Ο όρος ψυχοθεραπεία, απευθύνεται σε μία μορφή θεραπευτικής παρέμβασης, η οποία στοχεύει στην υποστήριξη των ανθρώπων που αντιμετωπίζουν διάφορες ψυχικές διαταραχες και συναισθηματικές δυσκολίες. Με άλλα λόγια, η ψυχοθεραπεία είναι το μέσο, όπου οι άνθρωποι μπορούν να ελέγξουν ή να περιορίσουν ενοχλητικά συμπτώματα, να αντιμετωπίσουν δυσκολίες σχετικές με την καθημερινότητα, το τραύμα, την απώλεια σε κάθε μορφή καθώς και συγκεκριμένες ψυχικές διαταραχές."
          ]
        },
        {
          title: "Λόγοι έναρξης ψυχοθεραπείας",
          paragraphs: [
            "Οι άνθρωποι αποφασίζουν να επισκεφτούν τους ειδικούς ψυχικής υγείας για διάφορους λόγους, καθώς οι ανάγκες του κάθε ατόμου ποικίλουν. Όλοι μας σε κάποια φάση της ζωής μας ερχόμαστε αντιμέτωποι με δυσκολίες οι οποίες επηρεάζουν την ψυχολογική διάθεση, τον κοινωνικό, οικογενειακό ή επαγγελματικό τομέα. Οι δυσκολίες αυτές είναι που καθιστούν χρήσιμη την συμβουλευτική παρέμβαση.",
            "Μερικά ενδεικτικά παραδείγματα δυσκολιών περιλαμβάνουν συναισθήματα θλίψης, μοναξιάς, αποτυχίας, άγχους, φοβίες, κρίσεις, θέματα ύπνου ή διατροφικής φύσεως, έλεγχος θυμού, κατάχρηση ουσιών ή αλκοόλ, αρνητικές σκέψεις, εμμονές, χαμηλή αυτοπεποίθηση, σεξουαλικές ανησυχίες, θέματα σχέσεων και γενικότερα δυσκολίες προσαρμογής σε αλλαγές."
          ]
        },
        {
          title: "Αρχές της ψυχοθεραπείας",
          paragraphs: [
            "Η ψυχοθεραπεία διέπεται από διάφορες αρχές, μία από αυτές είναι η συνεργασία ανάμεσα στον θεραπευτή και τον θεραπευόμενο, που έχει ως κοινό στόχο την ικανοποίηση των αιτημάτων του θεραπευόμενου. Αυτό προϋποθέτει θέληση και ουσιαστική συμμετοχή στην διαδικασία της ψυχοθεραπείας, ρεαλιστικές προσδοκίες καθώς η αλλαγή απαιτεί χρόνο, σύνδεση και δημιουργία της θεραπευτικής σχέσης η οποία συμβάλλει σημαντική στην πορεία της ψυχοθεραπείας.",
            "Μέσα από την συμβουλευτική και την υποστήριξη του θεραπευτή, οι άνθρωποι ενθαρρύνονται να σκεφτούν τις δυσκολίες που αντιμετωπίζουν, και επομένως να κατανοήσουν σε ένα μεγαλύτερο βαθμό την πηγή των δυσκολιών αυτών."
          ]
        },
        {
          title: "Θεραπευτικές συνεδρίες",
          paragraphs: [
            "Η ατομική συμβουλευτική είναι η πιο δημοφιλής θεραπεία. Οι συνεδρίες πραγματοποιούνται μία φορά την εβδομάδα για περίπου 50’, με εξαίρεση την πρώτη συνεδρία που έχει διάρκεια μία ώρα, έτσι ώστε ο θεραπευτής να δημιουργήσει μία καλύτερη εικόνα για τον θεραπευόμενο. Η κάθε συνεδρία αναφέρεται στην επίλυση των προβλημάτων ή των αιτημάτων του θεραπευόμενου, ο οποίος καλείται να μοιραστεί τα όσα τον/την απασχολούν και τους στόχους που θέλει να πετύχει μέσα από τις συνεδρίες.",
            "Οι συζητήσεις αυτές διέπονται από αυστηρή εμπιστευτικότητα, ειλικρίνεια, σεβασμό και απουσία επικριτικής στάσης. Ο καθένας έχει την δυνατότητα να μοιραστεί αυτό που επιθυμεί χωρίς το άγχος και τον φόβο της κρίσης ή της ντροπής. Ο αριθμός των συνεδριών, εξαρτάται από τις ανάγκες του κάθε ατόμου και το αρχικό αίτημα."
          ]
        }
      ],
      faq: {
        title: "Συχνές ερωτήσεις",
        items: [
            {
            q: "Πόσο συχνά γίνονται οι συνεδρίες;",
            a: "Συνήθως μία φορά την εβδομάδα, αλλά ο ρυθμός προσαρμόζεται στις ανάγκες και το αίτημά σου."
            },
            {
            q: "Πόσο διαρκεί η κάθε συνεδρία;",
            a: "Η τυπική συνεδρία διαρκεί περίπου 50′. Η πρώτη γνωριμία μπορεί να είναι ελαφρώς μεγαλύτερη."
            },
            {
            q: "Γίνονται συνεδρίες online;",
            a: "Ναι, προσφέρονται online συνεδρίες μέσω Viber, WhatsApp, Microsoft Teams και Google Meet."
            },
            {
            q: "Τι γίνεται αν χρειαστώ ακύρωση;",
            a: "Παρακαλώ ενημέρωσε τουλάχιστον 24 ώρες πριν για να μην επιβαρυνθεί η συνεδρία."
            },
            {
            q: "Είναι απόρρητες οι συνεδρίες;",
            a: "Ναι, τηρείται αυστηρά ο κώδικας δεοντολογίας και το απόρρητο, εκτός ειδικών νομικών εξαιρέσεων."
            },
            {
            q: "Δεν είμαι σίγουρος/η αν η θεραπεία είναι για εμένα. Τι μπορώ να κάνω;",
            a: "Μπορούμε να ξεκινήσουμε με μια σύντομη συνεδρία γνωριμίας ώστε να συζητήσουμε στόχους και προσδοκίες."
            }
        ]
    },
    },
  },
  en: {
    sessionsPage: {
      title: "Sessions",
      lead: {
        title: "Book your first therapy session",
        text:
          "Start your first in-person or online session with psyche.support. Remote sessions are available via Viber, WhatsApp, Microsoft Teams, and Google Meet.",
        bookCta: "Book here",
        bookHref: "https://cal.com/psyche-support",
      },
      online: {
        services: [
          { key: "viber", label: "Viber", helper: "Call or message", href: "viber://chat?number=%2B3069XXXXXXXX", aria: "Open Viber" },
          { key: "whatsapp", label: "WhatsApp", helper: "Call or message", href: "https://wa.me/3069XXXXXXXXX", aria: "Open WhatsApp" },
          { key: "teams", label: "Microsoft Teams", helper: "Session link", href: "https://teams.microsoft.com/l/meetup-join/...", aria: "Open Microsoft Teams" },
          { key: "meet", label: "Google Meet", helper: "Session link", href: "https://meet.google.com/your-code", aria: "Open Google Meet" }
        ]
      },
      sections: [
        {
          title: "What is psychotherapy?",
          paragraphs: [
            "Psychotherapy is a form of therapeutic intervention that supports people facing a range of mental health conditions and emotional difficulties. In other words, it is a process that helps you reduce distressing symptoms, face everyday challenges, and work through trauma, loss, and specific mental health concerns."
          ]
        },
        {
          title: "Reasons to start therapy",
          paragraphs: [
            "People seek mental health professionals for many reasons, and needs vary from person to person. At some point, most of us encounter difficulties that affect our mood and our social, family, or professional life. These challenges are where counselling can be particularly helpful.",
            "",
            "Indicative difficulties include sadness, loneliness, a sense of failure, anxiety, phobias, panic, sleep or eating issues, anger regulation, substance or alcohol misuse, negative thoughts, obsessions, low self-confidence, sexual concerns, relationship issues, and more broadly the strain of adapting to change."
          ]
        },
        {
          title: "Principles of psychotherapy",
          paragraphs: [
            "A core principle is collaboration between therapist and client, working together toward the client’s goals. This requires willingness and active participation, realistic expectations—since change takes time—and building a therapeutic relationship that meaningfully supports progress.",
            "With the counsellor’s guidance and support, people are encouraged to reflect on their difficulties and gain a deeper understanding of their origins."
          ]
        },
        {
          title: "Therapeutic sessions",
          paragraphs: [
            "Individual counselling is the most common format. Sessions are typically weekly and last about 50 minutes—except for the first session, which lasts around one hour to allow for a fuller initial understanding. Each session focuses on your concerns and goals.",
            "All conversations are strictly confidential and held with honesty, respect, and without judgment. You are free to share what you wish, without pressure or shame. The number of sessions depends on your needs and your initial aims."
          ]
        }
      ],
      faq: {
        title: "Frequently Asked Questions",
        items: [
            {
            q: "How often are sessions held?",
            a: "Typically once per week, though frequency can be adjusted to your needs and goals."
            },
            {
            q: "How long is each session?",
            a: "A standard session is about 50 minutes. The first meeting may be slightly longer."
            },
            {
            q: "Do you offer online sessions?",
            a: "Yes—online sessions are available via Viber, WhatsApp, Microsoft Teams, and Google Meet."
            },
            {
            q: "What is your cancellation policy?",
            a: "Please provide at least 24 hours’ notice to avoid being charged for the session."
            },
            {
            q: "Are sessions confidential?",
            a: "Yes. Confidentiality and ethical standards are strictly observed, except for specific legal exceptions."
            },
            {
            q: "I’m not sure therapy is for me—what can I do?",
            a: "We can begin with a brief introductory session to discuss your goals and expectations."
            }
        ]
      }
    },
  }
} as const;
