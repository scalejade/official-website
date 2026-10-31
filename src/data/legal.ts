import { CONTACT_EMAIL, LEGAL_ENTITIES } from '@/lib/company';

// ⚠️  HAVE COUNSEL REVIEW BEFORE THIS SHIPS. The text below describes what the
//     site actually does today (mailto form, Calendly embed, hosting logs,
//     Unsplash images, a language cookie, no analytics). If any of that changes —
//     a form backend, analytics, a CRM — this notice has to change with it.
//     Still to confirm: retention periods, the Data Protection Officer contact
//     (PDPA requires one to be published), registration numbers (UEN / NIB),
//     and governing law for the Terms.

export type LegalSection = {
    heading: string;
    paragraphs?: string[];
    list?: string[];
    /** Rendered after the list. */
    note?: string;
};

export type LegalDocument = {
    title: string;
    description: string;
    updatedLabel: string;
    updated: string; // ISO date
    intro: string;
    sections: LegalSection[];
};

const UPDATED = '2026-10-30';

const SG_ADDRESS = '9 Raffles Place, #16-20 Republic Plaza II, Singapore 048619';
const ID_ADDRESS = 'Kb. Melati, Tanah Abang, Jakarta Pusat 10230, Indonesia';

const privacyEn: LegalDocument = {
    title: 'Privacy Policy',
    description:
        'How ScaleJade collects, uses and protects personal data under Indonesia’s UU PDP No. 27/2022 and Singapore’s PDPA.',
    updatedLabel: 'Last updated',
    updated: UPDATED,
    intro:
        'This policy explains what personal data ScaleJade collects through scalejade.com, why, and what you can ask us to do with it. It is written to meet Indonesia’s Personal Data Protection Law (UU PDP No. 27/2022) and Singapore’s Personal Data Protection Act 2012 (PDPA).',
    sections: [
        {
            heading: 'Who we are',
            paragraphs: [
                `ScaleJade operates through two companies. ${LEGAL_ENTITIES.sg}, ${SG_ADDRESS}, is responsible for personal data handled in connection with Singapore and the wider region. ${LEGAL_ENTITIES.id}, ${ID_ADDRESS}, is responsible for personal data handled in connection with Indonesia. In this policy, “ScaleJade”, “we” and “us” mean whichever of the two is handling your data.`,
            ],
        },
        {
            heading: 'What we collect',
            list: [
                'Enquiries. When you use the contact form, your email application sends us your organisation name, email address and message. We receive whatever you choose to include.',
                'Call bookings. If you book a call, the scheduling provider (Calendly) collects your name, email address, the time you choose and any notes you add, and shares them with us.',
                'Correspondence. Emails you send us and our replies.',
                'Technical data. Our hosting provider records standard request data — IP address, approximate country, browser type, pages requested and time — to deliver and secure the site.',
            ],
            note:
                'We do not use analytics, advertising or tracking tools on this site, and we do not ask for sensitive personal data. Please do not send us confidential system details or personal data about third parties before an agreement is in place.',
        },
        {
            heading: 'Why we use it',
            list: [
                'To reply to your enquiry and arrange the conversation you asked for.',
                'To assess and prepare a potential engagement, at your request.',
                'To operate, secure and troubleshoot the website.',
                'To meet our legal obligations.',
            ],
            note:
                'We rely on your consent, on steps you ask us to take before entering a contract, and on our legitimate interest in running a secure website. We do not sell personal data or use it for automated decision-making.',
        },
        {
            heading: 'Cookies',
            paragraphs: [
                'The site itself sets at most a functional cookie that remembers your language choice. The embedded Calendly scheduler sets its own cookies, governed by Calendly’s privacy policy. Images on some articles load from Unsplash, which receives your IP address as part of serving them.',
            ],
        },
        {
            heading: 'Who we share it with',
            paragraphs: [
                'We share personal data only with service providers who help us run the site and our communication — hosting, email and scheduling — and only for those purposes, or where the law requires it. Some of these providers process data outside Indonesia and Singapore. Where that happens we rely on the safeguards UU PDP and the PDPA require, including contractual protections comparable to the standard of those laws.',
            ],
        },
        {
            heading: 'How long we keep it',
            paragraphs: [
                'We keep enquiry and booking data for as long as we need it to respond and to follow up on a potential engagement. If an engagement follows, related correspondence is kept for the period the contract and applicable law require. Otherwise we delete it or make it anonymous.',
            ],
        },
        {
            heading: 'How we protect it',
            paragraphs: [
                'Access to enquiry data is limited to the people who need it to respond. Data is encrypted in transit. If a breach affects your personal data, we will notify you and the relevant authority within the time the law requires.',
            ],
        },
        {
            heading: 'Your rights',
            paragraphs: ['Subject to the law that applies to you, you can ask us to:'],
            list: [
                'tell you what personal data we hold about you and give you a copy;',
                'correct data that is inaccurate or incomplete;',
                'stop processing, or delete, your data;',
                'withdraw consent you have given — this does not affect processing that already took place;',
                'restrict how we process your data, or object to it.',
            ],
        },
        {
            heading: 'Contact us',
            paragraphs: [
                `Send requests or questions to ${CONTACT_EMAIL} with the subject line “Personal data request”, for the attention of our Data Protection Officer. We reply within the time UU PDP and the PDPA allow. If you are not satisfied with our answer, you may complain to the Personal Data Protection Commission in Singapore or to the competent authority in Indonesia.`,
            ],
        },
        {
            heading: 'Changes to this policy',
            paragraphs: [
                'We update this policy when the way we handle personal data changes. The date at the top shows when it last changed.',
            ],
        },
    ],
};

const privacyId: LegalDocument = {
    title: 'Kebijakan Privasi',
    description:
        'Cara ScaleJade mengumpulkan, menggunakan, dan melindungi data pribadi berdasarkan UU PDP No. 27/2022 dan PDPA Singapura.',
    updatedLabel: 'Terakhir diperbarui',
    updated: UPDATED,
    intro:
        'Kebijakan ini menjelaskan data pribadi apa yang dikumpulkan ScaleJade melalui scalejade.com, untuk apa, dan apa yang dapat Anda minta kami lakukan terhadapnya. Kebijakan ini disusun untuk memenuhi Undang-Undang Pelindungan Data Pribadi (UU PDP No. 27/2022) dan Personal Data Protection Act 2012 Singapura (PDPA).',
    sections: [
        {
            heading: 'Siapa kami',
            paragraphs: [
                `ScaleJade beroperasi melalui dua perusahaan. ${LEGAL_ENTITIES.sg}, ${SG_ADDRESS}, bertanggung jawab atas data pribadi yang diproses terkait Singapura dan kawasan regional. ${LEGAL_ENTITIES.id}, ${ID_ADDRESS}, bertanggung jawab atas data pribadi yang diproses terkait Indonesia. Dalam kebijakan ini, “ScaleJade” dan “kami” berarti perusahaan mana pun yang memproses data Anda.`,
            ],
        },
        {
            heading: 'Data yang kami kumpulkan',
            list: [
                'Pertanyaan. Saat Anda menggunakan formulir kontak, aplikasi email Anda mengirimkan nama organisasi, alamat email, dan pesan Anda kepada kami. Kami menerima apa pun yang Anda pilih untuk dicantumkan.',
                'Pemesanan panggilan. Jika Anda memesan panggilan, penyedia penjadwalan (Calendly) mengumpulkan nama, alamat email, waktu yang Anda pilih, dan catatan yang Anda tambahkan, lalu membagikannya kepada kami.',
                'Korespondensi. Email yang Anda kirim kepada kami dan balasan kami.',
                'Data teknis. Penyedia hosting kami mencatat data permintaan standar — alamat IP, perkiraan negara, jenis peramban, halaman yang diminta, dan waktu — untuk menyajikan dan mengamankan situs.',
            ],
            note:
                'Kami tidak menggunakan alat analitik, iklan, atau pelacakan di situs ini, dan kami tidak meminta data pribadi yang bersifat spesifik. Mohon tidak mengirimkan detail sistem yang rahasia atau data pribadi pihak ketiga sebelum ada perjanjian.',
        },
        {
            heading: 'Untuk apa kami menggunakannya',
            list: [
                'Untuk membalas pertanyaan Anda dan mengatur percakapan yang Anda minta.',
                'Untuk menilai dan menyiapkan calon keterlibatan, atas permintaan Anda.',
                'Untuk mengoperasikan, mengamankan, dan memperbaiki situs web.',
                'Untuk memenuhi kewajiban hukum kami.',
            ],
            note:
                'Dasar pemrosesan kami adalah persetujuan Anda, langkah yang Anda minta sebelum membuat kontrak, dan kepentingan sah kami dalam menjalankan situs yang aman. Kami tidak menjual data pribadi dan tidak menggunakannya untuk pengambilan keputusan otomatis.',
        },
        {
            heading: 'Cookie',
            paragraphs: [
                'Situs ini sendiri paling banyak menetapkan satu cookie fungsional untuk mengingat pilihan bahasa Anda. Penjadwal Calendly yang disematkan menetapkan cookie-nya sendiri, yang tunduk pada kebijakan privasi Calendly. Gambar pada beberapa artikel dimuat dari Unsplash, yang menerima alamat IP Anda sebagai bagian dari penyajiannya.',
            ],
        },
        {
            heading: 'Dengan siapa kami membagikannya',
            paragraphs: [
                'Kami hanya membagikan data pribadi kepada penyedia layanan yang membantu kami menjalankan situs dan komunikasi — hosting, email, dan penjadwalan — dan hanya untuk tujuan tersebut, atau apabila diwajibkan oleh hukum. Sebagian penyedia ini memproses data di luar Indonesia dan Singapura. Dalam hal tersebut, kami menerapkan pelindungan yang disyaratkan UU PDP dan PDPA, termasuk perlindungan kontraktual yang setara dengan standar kedua undang-undang tersebut.',
            ],
        },
        {
            heading: 'Berapa lama kami menyimpannya',
            paragraphs: [
                'Kami menyimpan data pertanyaan dan pemesanan selama diperlukan untuk menanggapi dan menindaklanjuti calon keterlibatan. Jika keterlibatan terjadi, korespondensi terkait disimpan selama jangka waktu yang disyaratkan kontrak dan hukum yang berlaku. Selain itu, kami menghapus atau menganonimkannya.',
            ],
        },
        {
            heading: 'Cara kami melindunginya',
            paragraphs: [
                'Akses ke data pertanyaan dibatasi bagi orang yang memerlukannya untuk menanggapi. Data dienkripsi saat dikirim. Jika terjadi kegagalan pelindungan yang memengaruhi data pribadi Anda, kami akan memberi tahu Anda dan otoritas terkait dalam jangka waktu yang disyaratkan hukum.',
            ],
        },
        {
            heading: 'Hak Anda',
            paragraphs: ['Sesuai hukum yang berlaku bagi Anda, Anda dapat meminta kami untuk:'],
            list: [
                'memberi tahu data pribadi apa yang kami simpan tentang Anda dan memberikan salinannya;',
                'memperbaiki data yang tidak akurat atau tidak lengkap;',
                'menghentikan pemrosesan, atau menghapus, data Anda;',
                'menarik persetujuan yang telah Anda berikan — hal ini tidak memengaruhi pemrosesan yang sudah terjadi;',
                'membatasi cara kami memproses data Anda, atau menolaknya.',
            ],
        },
        {
            heading: 'Hubungi kami',
            paragraphs: [
                `Kirim permintaan atau pertanyaan ke ${CONTACT_EMAIL} dengan subjek “Permintaan data pribadi”, ditujukan kepada Pejabat Pelindungan Data Pribadi kami. Kami akan membalas dalam jangka waktu yang diatur UU PDP dan PDPA. Jika Anda tidak puas dengan tanggapan kami, Anda dapat mengajukan pengaduan kepada otoritas yang berwenang di Indonesia atau kepada Personal Data Protection Commission di Singapura.`,
            ],
        },
        {
            heading: 'Perubahan kebijakan ini',
            paragraphs: [
                'Kami memperbarui kebijakan ini ketika cara kami memproses data pribadi berubah. Tanggal di bagian atas menunjukkan kapan terakhir kali kebijakan ini diubah.',
            ],
        },
    ],
};

const termsEn: LegalDocument = {
    title: 'Terms of Use',
    description: 'The terms that apply when you use scalejade.com.',
    updatedLabel: 'Last updated',
    updated: UPDATED,
    intro: `These terms apply to your use of scalejade.com, operated by ${LEGAL_ENTITIES.sg} and ${LEGAL_ENTITIES.id}. By using the site you accept them. They do not govern client engagements — each engagement is governed by its own signed agreement.`,
    sections: [
        {
            heading: 'Information on this site',
            paragraphs: [
                'Articles, research and case studies on this site are general information about our work. They are not legal, regulatory, financial or engineering advice for your situation, and they do not create a client relationship. Regulations change; check the current text with the regulator or your advisers before relying on it.',
            ],
        },
        {
            heading: 'Intellectual property',
            paragraphs: [
                'Unless stated otherwise, the content, design and trademarks on this site belong to ScaleJade or its licensors. You may read, share links to and quote reasonable excerpts with attribution. Research papers may carry their own licence; where they do, that licence applies. Client names and logos belong to their owners.',
            ],
        },
        {
            heading: 'Acceptable use',
            paragraphs: [
                'Do not use the site in a way that breaks the law, interferes with its operation or security, or attempts to access systems or data you are not authorised to access. If you believe you have found a security vulnerability, report it to us at ' +
                    `${CONTACT_EMAIL} rather than testing it further.`,
            ],
        },
        {
            heading: 'Third-party services and links',
            paragraphs: [
                'The site embeds or links to services we do not control, such as our scheduling provider and social networks. Their own terms and privacy policies apply to them.',
            ],
        },
        {
            heading: 'No warranty and limitation of liability',
            paragraphs: [
                'We work to keep the site accurate and available, but it is provided “as is”, without warranties of any kind. To the extent the law allows, ScaleJade is not liable for loss arising from your use of, or reliance on, the site. Nothing in these terms limits liability that cannot be limited by law.',
            ],
        },
        {
            heading: 'Privacy',
            paragraphs: ['How we handle personal data is described in our Privacy Policy.'],
        },
        {
            heading: 'Changes and contact',
            paragraphs: [
                `We may update these terms; the date at the top shows when they last changed. Questions: ${CONTACT_EMAIL}.`,
            ],
        },
    ],
};

const termsId: LegalDocument = {
    title: 'Ketentuan Penggunaan',
    description: 'Ketentuan yang berlaku saat Anda menggunakan scalejade.com.',
    updatedLabel: 'Terakhir diperbarui',
    updated: UPDATED,
    intro: `Ketentuan ini berlaku atas penggunaan Anda terhadap scalejade.com, yang dioperasikan oleh ${LEGAL_ENTITIES.sg} dan ${LEGAL_ENTITIES.id}. Dengan menggunakan situs ini, Anda menyetujuinya. Ketentuan ini tidak mengatur keterlibatan klien — setiap keterlibatan diatur oleh perjanjian tertulisnya sendiri.`,
    sections: [
        {
            heading: 'Informasi di situs ini',
            paragraphs: [
                'Artikel, riset, dan studi kasus di situs ini merupakan informasi umum tentang pekerjaan kami. Informasi tersebut bukan nasihat hukum, regulasi, keuangan, atau rekayasa untuk situasi Anda, dan tidak menimbulkan hubungan klien. Regulasi dapat berubah; periksa teks terbaru kepada regulator atau penasihat Anda sebelum mengandalkannya.',
            ],
        },
        {
            heading: 'Kekayaan intelektual',
            paragraphs: [
                'Kecuali dinyatakan lain, konten, desain, dan merek dagang di situs ini milik ScaleJade atau pemberi lisensinya. Anda boleh membaca, membagikan tautan, dan mengutip bagian yang wajar dengan mencantumkan sumber. Makalah riset dapat memiliki lisensinya sendiri; jika demikian, lisensi tersebut yang berlaku. Nama dan logo klien adalah milik pemiliknya masing-masing.',
            ],
        },
        {
            heading: 'Penggunaan yang diperbolehkan',
            paragraphs: [
                'Jangan menggunakan situs ini dengan cara yang melanggar hukum, mengganggu operasional atau keamanannya, atau mencoba mengakses sistem atau data yang tidak Anda miliki izin aksesnya. Jika Anda yakin menemukan kerentanan keamanan, laporkan kepada kami di ' +
                    `${CONTACT_EMAIL} dan jangan mengujinya lebih lanjut.`,
            ],
        },
        {
            heading: 'Layanan dan tautan pihak ketiga',
            paragraphs: [
                'Situs ini menyematkan atau menautkan layanan yang tidak kami kendalikan, seperti penyedia penjadwalan dan jejaring sosial kami. Ketentuan dan kebijakan privasi masing-masing layanan tersebut yang berlaku.',
            ],
        },
        {
            heading: 'Tanpa jaminan dan batasan tanggung jawab',
            paragraphs: [
                'Kami berupaya menjaga situs ini akurat dan tersedia, tetapi situs ini disediakan “sebagaimana adanya”, tanpa jaminan apa pun. Sepanjang diizinkan hukum, ScaleJade tidak bertanggung jawab atas kerugian yang timbul dari penggunaan Anda atas, atau ketergantungan Anda pada, situs ini. Tidak ada dalam ketentuan ini yang membatasi tanggung jawab yang tidak dapat dibatasi menurut hukum.',
            ],
        },
        {
            heading: 'Privasi',
            paragraphs: ['Cara kami memproses data pribadi dijelaskan dalam Kebijakan Privasi kami.'],
        },
        {
            heading: 'Perubahan dan kontak',
            paragraphs: [
                `Kami dapat memperbarui ketentuan ini; tanggal di bagian atas menunjukkan kapan terakhir kali diubah. Pertanyaan: ${CONTACT_EMAIL}.`,
            ],
        },
    ],
};

export const LEGAL = {
    privacy: { en: privacyEn, id: privacyId },
    terms: { en: termsEn, id: termsId },
} as const;

export type LegalKind = keyof typeof LEGAL;

export function getLegalDocument(kind: LegalKind, locale: string): LegalDocument {
    return locale === 'id' ? LEGAL[kind].id : LEGAL[kind].en;
}
