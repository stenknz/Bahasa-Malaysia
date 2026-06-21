# Content System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Populate the app with 200 vocabulary words, 3-5 beginner lessons, grammar topics, and cultural content using a file-based content system.

**Architecture:** Content defined as JSON files under `content/`. A seed script reads all JSON files and inserts into PostgreSQL via Drizzle. Vocabulary files are independent and can be created in parallel.

**Tech Stack:** Drizzle ORM, PostgreSQL, JSON files, tsx

---

### Task 1: Content directory structure

**Files:**
- Create: `content/vocabulary/`
- Create: `content/lessons/`
- Create: `content/grammar/`
- Create: `content/culture/`

- [ ] **Step 1: Create directories**

Create empty directories under `content/`:
```
content/
  vocabulary/
  lessons/
  grammar/
  culture/
```

### Task 2: Vocabulary — Numbers (15 words)

**Files:**
- Create: `content/vocabulary/01-numbers.json`

- [ ] **Step 1: Create numbers vocabulary file**

```json
{
  "topic": "Nombor",
  "topicEnglish": "Numbers",
  "order": 1,
  "words": [
    { "malay": "satu", "english": "one", "exampleSentence": "Saya ada satu buku.", "exampleEnglish": "I have one book." },
    { "malay": "dua", "english": "two", "exampleSentence": "Dia ada dua ekor kucing.", "exampleEnglish": "She has two cats." },
    { "malay": "tiga", "english": "three", "exampleSentence": "Kami tinggal di sini tiga tahun.", "exampleEnglish": "We have lived here for three years." },
    { "malay": "empat", "english": "four", "exampleSentence": "Meja ini ada empat kaki.", "exampleEnglish": "This table has four legs." },
    { "malay": "lima", "english": "five", "exampleSentence": "Saya bangun pukul lima pagi.", "exampleEnglish": "I wake up at five in the morning." },
    { "malay": "enam", "english": "six", "exampleSentence": "Dia belajar enam jam sehari.", "exampleEnglish": "He studies six hours a day." },
    { "malay": "tujuh", "english": "seven", "exampleSentence": "Ada tujuh hari dalam seminggu.", "exampleEnglish": "There are seven days in a week." },
    { "malay": "lapan", "english": "eight", "exampleSentence": "Dia berumur lapan tahun.", "exampleEnglish": "She is eight years old." },
    { "malay": "sembilan", "english": "nine", "exampleSentence": "Kelas bermula pukul sembilan.", "exampleEnglish": "Class starts at nine." },
    { "malay": "sepuluh", "english": "ten", "exampleSentence": "Saya ada sepuluh jari.", "exampleEnglish": "I have ten fingers." },
    { "malay": "seratus", "english": "one hundred", "exampleSentence": "Buku ini ada seratus muka surat.", "exampleEnglish": "This book has one hundred pages." },
    { "malay": "seribu", "english": "one thousand", "exampleSentence": "Harga itu seribu ringgit.", "exampleEnglish": "That price is one thousand ringgit." },
    { "malay": "pertama", "english": "first", "exampleSentence": "Ini kali pertama saya ke sini.", "exampleEnglish": "This is my first time here." },
    { "malay": "kedua", "english": "second", "exampleSentence": "Dia anak kedua dalam keluarga.", "exampleEnglish": "He is the second child in the family." },
    { "malay": "separuh", "english": "half", "exampleSentence": "Tolong bagi saya separuh.", "exampleEnglish": "Please give me half." }
  ]
}
```

- [ ] **Step 2: Run validation**

Verify the JSON is valid: `node -e "JSON.parse(require('fs').readFileSync('content/vocabulary/01-numbers.json','utf8'))"`

### Task 3: Vocabulary — Food & Drink (25 words)

**Files:**
- Create: `content/vocabulary/02-food.json`

- [ ] **Step 1: Create food vocabulary file**

```json
{
  "topic": "Makanan & Minuman",
  "topicEnglish": "Food & Drink",
  "order": 2,
  "words": [
    { "malay": "nasi", "english": "rice", "exampleSentence": "Saya makan nasi setiap hari.", "exampleEnglish": "I eat rice every day." },
    { "malay": "ayam", "english": "chicken", "exampleSentence": "Dia suka ayam goreng.", "exampleEnglish": "She likes fried chicken." },
    { "malay": "ikan", "english": "fish", "exampleSentence": "Ikan ini sangat segar.", "exampleEnglish": "This fish is very fresh." },
    { "malay": "daging", "english": "meat", "exampleSentence": "Tolong potong daging itu.", "exampleEnglish": "Please cut the meat." },
    { "malay": "sayur", "english": "vegetables", "exampleSentence": "Kita perlu makan sayur.", "exampleEnglish": "We need to eat vegetables." },
    { "malay": "buah", "english": "fruit", "exampleSentence": "Buah ini manis sekali.", "exampleEnglish": "This fruit is very sweet." },
    { "malay": "roti", "english": "bread", "exampleSentence": "Saya makan roti untuk sarapan.", "exampleEnglish": "I eat bread for breakfast." },
    { "malay": "telur", "english": "egg", "exampleSentence": "Tolong rebus telur ini.", "exampleEnglish": "Please boil this egg." },
    { "malay": "susu", "english": "milk", "exampleSentence": "Anak itu minum susu.", "exampleEnglish": "The child drinks milk." },
    { "malay": "air", "english": "water", "exampleSentence": "Tolong bagi saya segelas air.", "exampleEnglish": "Please give me a glass of water." },
    { "malay": "kopi", "english": "coffee", "exampleSentence": "Dia minum kopi setiap pagi.", "exampleEnglish": "He drinks coffee every morning." },
    { "malay": "teh", "english": "tea", "exampleSentence": "Awak mahu teh atau kopi?", "exampleEnglish": "Do you want tea or coffee?" },
    { "malay": "gula", "english": "sugar", "exampleSentence": "Tolong kurangkan gula.", "exampleEnglish": "Please reduce the sugar." },
    { "malay": "garam", "english": "salt", "exampleSentence": "Masukkan sedikit garam.", "exampleEnglish": "Add a little salt." },
    { "malay": "pedas", "english": "spicy", "exampleSentence": "Makanan ini sangat pedas.", "exampleEnglish": "This food is very spicy." },
    { "malay": "masin", "english": "salty", "exampleSentence": "Sup ini terlalu masin.", "exampleEnglish": "This soup is too salty." },
    { "malay": "manis", "english": "sweet", "exampleSentence": "Kek ini sangat manis.", "exampleEnglish": "This cake is very sweet." },
    { "malay": "pahit", "english": "bitter", "exampleSentence": "Ubat ini rasa pahit.", "exampleEnglish": "This medicine tastes bitter." },
    { "malay": "masak", "english": "to cook", "exampleSentence": "Dia suka masak untuk keluarga.", "exampleEnglish": "She likes to cook for the family." },
    { "malay": "makan", "english": "to eat", "exampleSentence": "Jom makan bersama-sama.", "exampleEnglish": "Let's eat together." },
    { "malay": "minum", "english": "to drink", "exampleSentence": "Awak mahu minum apa?", "exampleEnglish": "What would you like to drink?" },
    { "malay": "lapar", "english": "hungry", "exampleSentence": "Saya sangat lapar sekarang.", "exampleEnglish": "I am very hungry now." },
    { "malay": "dahaga", "english": "thirsty", "exampleSentence": "Dia berasa dahaga selepas berlari.", "exampleEnglish": "She felt thirsty after running." },
    { "malay": "sarapan", "english": "breakfast", "exampleSentence": "Sarapan pagi penting untuk kesihatan.", "exampleEnglish": "Breakfast is important for health." },
    { "malay": "makan malam", "english": "dinner", "exampleSentence": "Kami makan malam pukul lapan.", "exampleEnglish": "We have dinner at eight o'clock." }
  ]
}
```

- [ ] **Step 2: Validate JSON**

### Task 4: Vocabulary — Family (15 words)

**Files:**
- Create: `content/vocabulary/03-family.json`

- [ ] **Step 1: Create family vocabulary file**

```json
{
  "topic": "Keluarga",
  "topicEnglish": "Family",
  "order": 3,
  "words": [
    { "malay": "ibu", "english": "mother", "exampleSentence": "Ibu saya seorang guru.", "exampleEnglish": "My mother is a teacher." },
    { "malay": "bapa", "english": "father", "exampleSentence": "Bapa saya bekerja di pejabat.", "exampleEnglish": "My father works at an office." },
    { "malay": "abang", "english": "older brother", "exampleSentence": "Abang saya lebih tua dua tahun.", "exampleEnglish": "My older brother is two years older." },
    { "malay": "kakak", "english": "older sister", "exampleSentence": "Kakak saya pandai memasak.", "exampleEnglish": "My older sister is good at cooking." },
    { "malay": "adik", "english": "younger sibling", "exampleSentence": "Adik saya masih kecil.", "exampleEnglish": "My younger sibling is still small." },
    { "malay": "datuk", "english": "grandfather", "exampleSentence": "Datuk saya berumur tujuh puluh tahun.", "exampleEnglish": "My grandfather is seventy years old." },
    { "malay": "nenek", "english": "grandmother", "exampleSentence": "Nenek tinggal di kampung.", "exampleEnglish": "Grandmother lives in the village." },
    { "malay": "suami", "english": "husband", "exampleSentence": "Suami saya bekerja di hospital.", "exampleEnglish": "My husband works at a hospital." },
    { "malay": "isteri", "english": "wife", "exampleSentence": "Isteri saya seorang doktor.", "exampleEnglish": "My wife is a doctor." },
    { "malay": "anak", "english": "child", "exampleSentence": "Dia ada tiga orang anak.", "exampleEnglish": "She has three children." },
    { "malay": "saudara", "english": "relative", "exampleSentence": "Dia saudara saya dari Johor.", "exampleEnglish": "He is my relative from Johor." },
    { "malay": "keluarga", "english": "family", "exampleSentence": "Keluarga saya besar.", "exampleEnglish": "My family is big." },
    { "malay": "nama", "english": "name", "exampleSentence": "Nama saya Ahmad.", "exampleEnglish": "My name is Ahmad." },
    { "malay": "panggil", "english": "to call", "exampleSentence": "Tolong panggil dia.", "exampleEnglish": "Please call him." },
    { "malay": "sayang", "english": "to love / dear", "exampleSentence": "Saya sayang keluarga saya.", "exampleEnglish": "I love my family." }
  ]
}
```

- [ ] **Step 2: Validate JSON**

### Task 5: Vocabulary — Places & Directions (20 words)

**Files:**
- Create: `content/vocabulary/04-places.json`

- [ ] **Step 1: Create vocabulary file**

```json
{
  "topic": "Tempat & Arah",
  "topicEnglish": "Places & Directions",
  "order": 4,
  "words": [
    { "malay": "rumah", "english": "house / home", "exampleSentence": "Saya balik rumah pukul enam.", "exampleEnglish": "I go home at six o'clock." },
    { "malay": "sekolah", "english": "school", "exampleSentence": "Dia pergi sekolah setiap hari.", "exampleEnglish": "She goes to school every day." },
    { "malay": "pejabat", "english": "office", "exampleSentence": "Dia bekerja di pejabat bank.", "exampleEnglish": "He works at a bank office." },
    { "malay": "hospital", "english": "hospital", "exampleSentence": "Dia pergi hospital kerana sakit.", "exampleEnglish": "He went to the hospital because he was sick." },
    { "malay": "pasar", "english": "market", "exampleSentence": "Ibu pergi pasar setiap pagi.", "exampleEnglish": "Mother goes to the market every morning." },
    { "malay": "kedai", "english": "shop / store", "exampleSentence": "Kedai itu buka pukul sembilan.", "exampleEnglish": "The shop opens at nine o'clock." },
    { "malay": "masjid", "english": "mosque", "exampleSentence": "Dia pergi masjid pada hari Jumaat.", "exampleEnglish": "He goes to the mosque on Friday." },
    { "malay": "taman", "english": "park / garden", "exampleSentence": "Kami berjalan di taman.", "exampleEnglish": "We walk in the park." },
    { "malay": "kiri", "english": "left", "exampleSentence": "Tolong pusing ke kiri.", "exampleEnglish": "Please turn left." },
    { "malay": "kanan", "english": "right", "exampleSentence": "Sekolah itu di sebelah kanan.", "exampleEnglish": "The school is on the right side." },
    { "malay": "depan", "english": "front", "exampleSentence": "Dia duduk di depan kelas.", "exampleEnglish": "She sits at the front of the class." },
    { "malay": "belakang", "english": "back / behind", "exampleSentence": "Tandas di belakang bangunan.", "exampleEnglish": "The toilet is behind the building." },
    { "malay": "atas", "english": "above / on top", "exampleSentence": "Buku itu di atas meja.", "exampleEnglish": "The book is on the table." },
    { "malay": "bawah", "english": "below / under", "exampleSentence": "Kucing itu di bawah kerusi.", "exampleEnglish": "The cat is under the chair." },
    { "malay": "dalam", "english": "inside", "exampleSentence": "Dia berada di dalam bilik.", "exampleEnglish": "He is inside the room." },
    { "malay": "luar", "english": "outside", "exampleSentence": "Mereka bermain di luar.", "exampleEnglish": "They are playing outside." },
    { "malay": "dekat", "english": "near / close", "exampleSentence": "Rumah saya dekat dengan sekolah.", "exampleEnglish": "My house is near the school." },
    { "malay": "jauh", "english": "far", "exampleSentence": "Kampung dia jauh dari sini.", "exampleEnglish": "His village is far from here." },
    { "malay": "sebelah", "english": "next to / side", "exampleSentence": "Dia duduk di sebelah saya.", "exampleEnglish": "He sits next to me." },
    { "malay": "sini", "english": "here", "exampleSentence": "Tolong datang sini.", "exampleEnglish": "Please come here." }
  ]
}
```

- [ ] **Step 2: Validate JSON**

### Task 6: Vocabulary — Time & Weather (20 words)

**Files:**
- Create: `content/vocabulary/05-time-weather.json`

- [ ] **Step 1: Create vocabulary file**

```json
{
  "topic": "Masa & Cuaca",
  "topicEnglish": "Time & Weather",
  "order": 5,
  "words": [
    { "malay": "hari", "english": "day", "exampleSentence": "Ada tujuh hari dalam seminggu.", "exampleEnglish": "There are seven days in a week." },
    { "malay": "minggu", "english": "week", "exampleSentence": "Saya kerja lima hari seminggu.", "exampleEnglish": "I work five days a week." },
    { "malay": "bulan", "english": "month", "exampleSentence": "Bulan ini saya ada cuti.", "exampleEnglish": "This month I have a holiday." },
    { "malay": "tahun", "english": "year", "exampleSentence": "Tahun depan saya nak melancong.", "exampleEnglish": "Next year I want to travel." },
    { "malay": "pagi", "english": "morning", "exampleSentence": "Saya bangun awal pagi.", "exampleEnglish": "I wake up early in the morning." },
    { "malay": "tengah hari", "english": "afternoon / noon", "exampleSentence": "Kami makan tengah hari bersama.", "exampleEnglish": "We have lunch together." },
    { "malay": "petang", "english": "evening", "exampleSentence": "Dia balik kerja pada petang.", "exampleEnglish": "He returns from work in the evening." },
    { "malay": "malam", "english": "night", "exampleSentence": "Selamat malam, jumpa lagi.", "exampleEnglish": "Good night, see you again." },
    { "malay": "semalam", "english": "yesterday", "exampleSentence": "Semalam hujan lebat.", "exampleEnglish": "Yesterday it rained heavily." },
    { "malay": "hari ini", "english": "today", "exampleSentence": "Hari ini saya sibuk.", "exampleEnglish": "Today I am busy." },
    { "malay": "esok", "english": "tomorrow", "exampleSentence": "Esok kita ada mesyuarat.", "exampleEnglish": "Tomorrow we have a meeting." },
    { "malay": "sekarang", "english": "now", "exampleSentence": "Saya sedang makan sekarang.", "exampleEnglish": "I am eating now." },
    { "malay": "hujan", "english": "rain", "exampleSentence": "Hujan turun dengan lebat.", "exampleEnglish": "The rain is falling heavily." },
    { "malay": "panas", "english": "hot", "exampleSentence": "Cuaca hari ini sangat panas.", "exampleEnglish": "The weather today is very hot." },
    { "malay": "sejuk", "english": "cold", "exampleSentence": "Air ini terasa sejuk.", "exampleEnglish": "This water feels cold." },
    { "malay": "angin", "english": "wind", "exampleSentence": "Angin bertiup kencang.", "exampleEnglish": "The wind is blowing strongly." },
    { "malay": "matahari", "english": "sun", "exampleSentence": "Matahari terbit di timur.", "exampleEnglish": "The sun rises in the east." },
    { "malay": "awan", "english": "cloud", "exampleSentence": "Langit penuh dengan awan.", "exampleEnglish": "The sky is full of clouds." },
    { "malay": "panas terik", "english": "scorching hot", "exampleSentence": "Cuaca panas terik hari ini.", "exampleEnglish": "The weather is scorching hot today." },
    { "malay": "berangin", "english": "windy", "exampleSentence": "Hari ini sangat berangin.", "exampleEnglish": "Today is very windy." }
  ]
}
```

- [ ] **Step 2: Validate JSON**

### Task 7: Vocabulary — Shopping (20 words)

**Files:**
- Create: `content/vocabulary/06-shopping.json`

- [ ] **Step 1: Create vocabulary file**

```json
{
  "topic": "Belanja",
  "topicEnglish": "Shopping",
  "order": 6,
  "words": [
    { "malay": "beli", "english": "to buy", "exampleSentence": "Saya nak beli baju baru.", "exampleEnglish": "I want to buy new clothes." },
    { "malay": "jual", "english": "to sell", "exampleSentence": "Dia jual buah di pasar.", "exampleEnglish": "He sells fruit at the market." },
    { "malay": "harga", "english": "price", "exampleSentence": "Harga barang ini mahal.", "exampleEnglish": "The price of this item is expensive." },
    { "malay": "murah", "english": "cheap", "exampleSentence": "Baju ini sangat murah.", "exampleEnglish": "This shirt is very cheap." },
    { "malay": "mahal", "english": "expensive", "exampleSentence": "Kereta itu terlalu mahal.", "exampleEnglish": "That car is too expensive." },
    { "malay": "wang", "english": "money", "exampleSentence": "Saya tidak ada wang sekarang.", "exampleEnglish": "I don't have money now." },
    { "malay": "bayar", "english": "to pay", "exampleSentence": "Tolong bayar di kaunter.", "exampleEnglish": "Please pay at the counter." },
    { "malay": "dompet", "english": "wallet", "exampleSentence": "Dompet saya hilang.", "exampleEnglish": "My wallet is lost." },
    { "malay": "beg", "english": "bag", "exampleSentence": "Dia bawa beg besar.", "exampleEnglish": "She carries a big bag." },
    { "malay": "baju", "english": "clothes / shirt", "exampleSentence": "Baju ini cantik.", "exampleEnglish": "This shirt is beautiful." },
    { "malay": "seluar", "english": "pants", "exampleSentence": "Dia pakai seluar hitam.", "exampleEnglish": "He wears black pants." },
    { "malay": "kasut", "english": "shoes", "exampleSentence": "Kasut baru saya selesa.", "exampleEnglish": "My new shoes are comfortable." },
    { "malay": "saiz", "english": "size", "exampleSentence": "Awak pakai saiz apa?", "exampleEnglish": "What size do you wear?" },
    { "malay": "warna", "english": "color", "exampleSentence": "Saya suka warna biru.", "exampleEnglish": "I like the color blue." },
    { "malay": "diskaun", "english": "discount", "exampleSentence": "Ada diskaun tiga puluh peratus.", "exampleEnglish": "There is a thirty percent discount." },
    { "malay": "percuma", "english": "free (no cost)", "exampleSentence": "Penghantaran adalah percuma.", "exampleEnglish": "Delivery is free." },
    { "malay": "tukar", "english": "to change / exchange", "exampleSentence": "Boleh saya tukar saiz ini?", "exampleEnglish": "Can I exchange this size?" },
    { "malay": "pulangan", "english": "refund / return", "exampleSentence": "Saya minta pulangan wang.", "exampleEnglish": "I want a refund." },
    { "malay": "cukup", "english": "enough", "exampleSentence": "Wang ini tidak cukup.", "exampleEnglish": "This money is not enough." },
    { "malay": "kurang", "english": "less / not enough", "exampleSentence": "Harga itu kurang dari jangkaan.", "exampleEnglish": "The price is less than expected." }
  ]
}
```

- [ ] **Step 2: Validate JSON**

### Task 8: Vocabulary — Transport (20 words)

**Files:**
- Create: `content/vocabulary/07-transport.json`

- [ ] **Step 1: Create vocabulary file**

```json
{
  "topic": "Pengangkutan",
  "topicEnglish": "Transport",
  "order": 7,
  "words": [
    { "malay": "kereta", "english": "car", "exampleSentence": "Dia memandu kereta baru.", "exampleEnglish": "He drives a new car." },
    { "malay": "bas", "english": "bus", "exampleSentence": "Saya naik bas ke sekolah.", "exampleEnglish": "I take the bus to school." },
    { "malay": "keretapi", "english": "train", "exampleSentence": "Keretapi bertolak pukul lapan.", "exampleEnglish": "The train departs at eight." },
    { "malay": "kapal terbang", "english": "airplane", "exampleSentence": "Kapal terbang mendarat dengan selamat.", "exampleEnglish": "The airplane landed safely." },
    { "malay": "teksi", "english": "taxi", "exampleSentence": "Kami naik teksi ke hotel.", "exampleEnglish": "We took a taxi to the hotel." },
    { "malay": "motosikal", "english": "motorcycle", "exampleSentence": "Dia pergi kerja naik motosikal.", "exampleEnglish": "He goes to work by motorcycle." },
    { "malay": "basikal", "english": "bicycle", "exampleSentence": "Saya suka berbasikal pada hujung minggu.", "exampleEnglish": "I like to cycle on weekends." },
    { "malay": "jalan", "english": "road / street", "exampleSentence": "Jalan ini sesak pada waktu pagi.", "exampleEnglish": "This road is congested in the morning." },
    { "malay": "tiket", "english": "ticket", "exampleSentence": "Tolong beli dua tiket.", "exampleEnglish": "Please buy two tickets." },
    { "malay": "stesen", "english": "station", "exampleSentence": "Stesen bas berdekatan dengan sini.", "exampleEnglish": "The bus station is near here." },
    { "malay": "lapangan terbang", "english": "airport", "exampleSentence": "Kami perlu ke lapangan terbang dua jam awal.", "exampleEnglish": "We need to go to the airport two hours early." },
    { "malay": "pandu", "english": "to drive", "exampleSentence": "Dia pandu kereta dengan berhati-hati.", "exampleEnglish": "He drives carefully." },
    { "malay": "naik", "english": "to ride / board", "exampleSentence": "Jom naik bas ini.", "exampleEnglish": "Let's board this bus." },
    { "malay": "turun", "english": "to get off / descend", "exampleSentence": "Saya turun di stesen seterusnya.", "exampleEnglish": "I get off at the next station." },
    { "malay": "pergi", "english": "to go", "exampleSentence": "Dia pergi ke pasar.", "exampleEnglish": "She goes to the market." },
    { "malay": "sampai", "english": "to arrive", "exampleSentence": "Kami sampai pada pukul sepuluh.", "exampleEnglish": "We arrived at ten o'clock." },
    { "malay": "bertolak", "english": "to depart", "exampleSentence": "Bas akan bertolak dalam lima minit.", "exampleEnglish": "The bus will depart in five minutes." },
    { "malay": "sesak", "english": "crowded", "exampleSentence": "Keretapi ini terlalu sesak.", "exampleEnglish": "This train is too crowded." },
    { "malay": "lambat", "english": "late / slow", "exampleSentence": "Bas selalu lambat.", "exampleEnglish": "The bus is always late." },
    { "malay": "cepat", "english": "fast / quick", "exampleSentence": "Kereta ini sangat cepat.", "exampleEnglish": "This car is very fast." }
  ]
}
```

- [ ] **Step 2: Validate JSON**

### Task 9: Vocabulary — Career (20 words)

**Files:**
- Create: `content/vocabulary/08-career.json`

- [ ] **Step 1: Create vocabulary file**

```json
{
  "topic": "Kerjaya",
  "topicEnglish": "Career",
  "order": 8,
  "words": [
    { "malay": "kerja", "english": "work / job", "exampleSentence": "Dia cari kerja baru.", "exampleEnglish": "He is looking for a new job." },
    { "malay": "gaji", "english": "salary", "exampleSentence": "Gaji saya naik tahun ini.", "exampleEnglish": "My salary increased this year." },
    { "malay": "bos", "english": "boss", "exampleSentence": "Bos saya sangat baik.", "exampleEnglish": "My boss is very kind." },
    { "malay": "pekerja", "english": "employee / worker", "exampleSentence": "Ada lima puluh pekerja di sini.", "exampleEnglish": "There are fifty employees here." },
    { "malay": "mesyuarat", "english": "meeting", "exampleSentence": "Mesyuarat bermula pukul sepuluh.", "exampleEnglish": "The meeting starts at ten." },
    { "malay": "doktor", "english": "doctor", "exampleSentence": "Doktor memeriksa pesakit.", "exampleEnglish": "The doctor examined the patient." },
    { "malay": "guru", "english": "teacher", "exampleSentence": "Guru itu mengajar bahasa Melayu.", "exampleEnglish": "The teacher teaches Malay." },
    { "malay": "jurutera", "english": "engineer", "exampleSentence": "Dia seorang jurutera awam.", "exampleEnglish": "He is a civil engineer." },
    { "malay": "polis", "english": "police", "exampleSentence": "Polis datang dengan cepat.", "exampleEnglish": "The police came quickly." },
    { "malay": "peniaga", "english": "businessperson", "exampleSentence": "Dia peniaga yang berjaya.", "exampleEnglish": "She is a successful businessperson." },
    { "malay": "jadual", "english": "schedule", "exampleSentence": "Saya ada jadual yang sibuk.", "exampleEnglish": "I have a busy schedule." },
    { "malay": "cuti", "english": "holiday / leave", "exampleSentence": "Saya ambil cuti minggu depan.", "exampleEnglish": "I am taking leave next week." },
    { "malay": "tugas", "english": "duty / task", "exampleSentence": "Itu tugasan saya setiap hari.", "exampleEnglish": "That is my duty every day." },
    { "malay": "rajin", "english": "diligent / hardworking", "exampleSentence": "Dia seorang pekerja yang rajin.", "exampleEnglish": "He is a hardworking employee." },
    { "malay": "malas", "english": "lazy", "exampleSentence": "Jangan malas belajar.", "exampleEnglish": "Don't be lazy to study." },
    { "malay": "pandai", "english": "clever / skillful", "exampleSentence": "Dia pandai menyanyi.", "exampleEnglish": "She is good at singing." },
    { "malay": "latihan", "english": "training / practice", "exampleSentence": "Latihan ini sangat berguna.", "exampleEnglish": "This training is very useful." },
    { "malay": "lulus", "english": "to pass", "exampleSentence": "Dia lulus peperiksaan.", "exampleEnglish": "He passed the exam." },
    { "malay": "gagal", "english": "to fail", "exampleSentence": "Saya gagal ujian memandu.", "exampleEnglish": "I failed the driving test." },
    { "malay": "cuba", "english": "to try", "exampleSentence": "Tolong cuba lagi.", "exampleEnglish": "Please try again." }
  ]
}
```

- [ ] **Step 2: Validate JSON**

### Task 10: Vocabulary — Health (25 words)

**Files:**
- Create: `content/vocabulary/09-health.json`

- [ ] **Step 1: Create vocabulary file**

```json
{
  "topic": "Kesihatan",
  "topicEnglish": "Health",
  "order": 9,
  "words": [
    { "malay": "sakit", "english": "sick / pain", "exampleSentence": "Saya rasa sakit kepala.", "exampleEnglish": "I have a headache." },
    { "malay": "sihat", "english": "healthy", "exampleSentence": "Dia kelihatan sihat.", "exampleEnglish": "He looks healthy." },
    { "malay": "demam", "english": "fever", "exampleSentence": "Dia demam sejak semalam.", "exampleEnglish": "He has had a fever since yesterday." },
    { "malay": "batuk", "english": "cough", "exampleSentence": "Tolong tutup mulut semasa batuk.", "exampleEnglish": "Please cover your mouth when coughing." },
    { "malay": "selsema", "english": "flu", "exampleSentence": "Saya kena selsema.", "exampleEnglish": "I have the flu." },
    { "malay": "ubat", "english": "medicine", "exampleSentence": "Tolong ambil ubat ini tiga kali sehari.", "exampleEnglish": "Please take this medicine three times a day." },
    { "malay": "doktor", "english": "doctor", "exampleSentence": "Doktor bagi saya surat cuti.", "exampleEnglish": "The doctor gave me a sick note." },
    { "malay": "jururawat", "english": "nurse", "exampleSentence": "Jururawat itu sangat peramah.", "exampleEnglish": "The nurse is very friendly." },
    { "malay": "hospital", "english": "hospital", "exampleSentence": "Dia dimasukkan ke hospital.", "exampleEnglish": "He was admitted to the hospital." },
    { "malay": "klinik", "english": "clinic", "exampleSentence": "Klinik buka dari pukul lapan pagi.", "exampleEnglish": "The clinic opens from eight in the morning." },
    { "malay": "rehat", "english": "rest", "exampleSentence": "Awak perlu rehat yang cukup.", "exampleEnglish": "You need enough rest." },
    { "malay": "tidur", "english": "to sleep", "exampleSentence": "Dia tidur awal setiap malam.", "exampleEnglish": "She sleeps early every night." },
    { "malay": "letih", "english": "tired", "exampleSentence": "Saya berasa letih selepas kerja.", "exampleEnglish": "I feel tired after work." },
    { "malay": "senaman", "english": "exercise", "exampleSentence": "Senaman baik untuk kesihatan.", "exampleEnglish": "Exercise is good for health." },
    { "malay": "berjalan", "english": "to walk", "exampleSentence": "Kami berjalan di taman setiap pagi.", "exampleEnglish": "We walk in the park every morning." },
    { "malay": "berlari", "english": "to run", "exampleSentence": "Dia suka berlari di padang.", "exampleEnglish": "He likes to run on the field." },
    { "malay": "berenang", "english": "to swim", "exampleSentence": "Mereka berenang di pantai.", "exampleEnglish": "They swim at the beach." },
    { "malay": "badan", "english": "body", "exampleSentence": "Badan saya rasa sakit semua.", "exampleEnglish": "My whole body feels sore." },
    { "malay": "kepala", "english": "head", "exampleSentence": "Saya pusing kepala.", "exampleEnglish": "I feel dizzy." },
    { "malay": "mata", "english": "eye", "exampleSentence": "Mata dia sangat cantik.", "exampleEnglish": "Her eyes are very beautiful." },
    { "malay": "tangan", "english": "hand / arm", "exampleSentence": "Tolong basuh tangan sebelum makan.", "exampleEnglish": "Please wash your hands before eating." },
    { "malay": "kaki", "english": "foot / leg", "exampleSentence": "Kaki saya sakit selepas berlari.", "exampleEnglish": "My legs are sore after running." },
    { "malay": "perut", "english": "stomach", "exampleSentence": "Perut saya lapar.", "exampleEnglish": "My stomach is hungry." },
    { "malay": "diet", "english": "diet", "exampleSentence": "Dia sedang berdiet.", "exampleEnglish": "She is on a diet." },
    { "malay": "berat", "english": "weight / heavy", "exampleSentence": "Berat badan dia naik.", "exampleEnglish": "His body weight increased." }
  ]
}
```

- [ ] **Step 2: Validate JSON**

### Task 11: Vocabulary — Daily Activities (20 words)

**Files:**
- Create: `content/vocabulary/10-daily-activities.json`

- [ ] **Step 1: Create vocabulary file**

```json
{
  "topic": "Aktiviti Harian",
  "topicEnglish": "Daily Activities",
  "order": 10,
  "words": [
    { "malay": "bangun", "english": "to wake up", "exampleSentence": "Saya bangun pukul lima pagi.", "exampleEnglish": "I wake up at five in the morning." },
    { "malay": "mandi", "english": "to bathe", "exampleSentence": "Dia mandi sebelum sarapan.", "exampleEnglish": "He showers before breakfast." },
    { "malay": "pakai", "english": "to wear", "exampleSentence": "Dia pakai baju putih.", "exampleEnglish": "She wears a white shirt." },
    { "malay": "makan", "english": "to eat", "exampleSentence": "Mari kita makan bersama.", "exampleEnglish": "Let's eat together." },
    { "malay": "minum", "english": "to drink", "exampleSentence": "Saya minum air kosong.", "exampleEnglish": "I drink plain water." },
    { "malay": "baca", "english": "to read", "exampleSentence": "Dia suka baca buku.", "exampleEnglish": "She likes to read books." },
    { "malay": "tulis", "english": "to write", "exampleSentence": "Tolong tulis nama awak.", "exampleEnglish": "Please write your name." },
    { "malay": "dengar", "english": "to listen", "exampleSentence": "Saya dengar radio setiap pagi.", "exampleEnglish": "I listen to the radio every morning." },
    { "malay": "cakap", "english": "to speak", "exampleSentence": "Dia cakap bahasa Melayu.", "exampleEnglish": "He speaks Malay." },
    { "malay": "belajar", "english": "to study", "exampleSentence": "Dia belajar di universiti.", "exampleEnglish": "She studies at university." },
    { "malay": "ajar", "english": "to teach", "exampleSentence": "Dia ajar bahasa Inggeris.", "exampleEnglish": "He teaches English." },
    { "malay": "main", "english": "to play", "exampleSentence": "Kanak-kanak main di padang.", "exampleEnglish": "The children play on the field." },
    { "malay": "masak", "english": "to cook", "exampleSentence": "Ibu masak nasi lemak.", "exampleEnglish": "Mother cooks nasi lemak." },
    { "malay": "cuci", "english": "to wash", "exampleSentence": "Tolong cuci pinggan ini.", "exampleEnglish": "Please wash these dishes." },
    { "malay": "kemas", "english": "to tidy up", "exampleSentence": "Dia kemas bilik setiap hari.", "exampleEnglish": "She tidies her room every day." },
    { "malay": "basuh", "english": "to wash (clothes)", "exampleSentence": "Saya basuh baju pada hujung minggu.", "exampleEnglish": "I wash clothes on the weekend." },
    { "malay": "lipat", "english": "to fold", "exampleSentence": "Tolong lipat baju itu.", "exampleEnglish": "Please fold those clothes." },
    { "malay": "tonton", "english": "to watch", "exampleSentence": "Kami tonton wayang bersama.", "exampleEnglish": "We watch a movie together." },
    { "malay": "beli", "english": "to buy", "exampleSentence": "Dia beli sayur di pasar.", "exampleEnglish": "She buys vegetables at the market." },
    { "malay": "balik", "english": "to return / go home", "exampleSentence": "Saya balik rumah pukul enam.", "exampleEnglish": "I return home at six o'clock." }
  ]
}
```

- [ ] **Step 2: Validate JSON**

### Task 12: Lesson content files (3 lessons)

**Files:**
- Create: `content/lessons/01-greetings.json`
- Create: `content/lessons/02-food.json`
- Create: `content/lessons/03-family.json`

- [ ] **Step 1: Create Lesson 1 — Greetings & Introductions**

```json
{
  "slug": "greetings",
  "title": "Greetings & Introductions",
  "description": "Learn how to greet people and introduce yourself in Malay.",
  "order": 1,
  "level": "beginner",
  "sections": {
    "vocabulary": ["selamat pagi", "apa khabar", "siapa", "nama", "saya", "anda", "jumpa lagi"],
    "grammar": {
      "title": "Basic Sentence Structure",
      "explanation": "Malay sentences follow Subject-Verb-Object order, just like English. There are no articles (a/an/the) and no verb conjugations for tense.",
      "examples": [
        { "malay": "Saya Ali.", "english": "I am Ali." },
        { "malay": "Dia guru.", "english": "He/She is a teacher." }
      ]
    },
    "dialogue": [
      { "speaker": "Ali", "malay": "Selamat pagi! Apa khabar?", "english": "Good morning! How are you?" },
      { "speaker": "Siti", "malay": "Khabar baik. Siapa nama awak?", "english": "I'm fine. What is your name?" },
      { "speaker": "Ali", "malay": "Nama saya Ali. Saya dari Kuala Lumpur.", "english": "My name is Ali. I am from Kuala Lumpur." },
      { "speaker": "Siti", "malay": "Selamat berkenalan, Ali!", "english": "Nice to meet you, Ali!" },
      { "speaker": "Ali", "malay": "Selamat berkenalan! Jumpa lagi!", "english": "Nice to meet you! See you again!" }
    ],
    "exercise": [
      { "question": "How do you say 'Good morning' in Malay?", "options": ["Selamat malam", "Selamat pagi", "Selamat petang", "Selamat tinggal"], "correct": 1 },
      { "question": "What does 'Apa khabar' mean?", "options": ["Goodbye", "Thank you", "How are you", "Good night"], "correct": 2 },
      { "question": "How do you introduce yourself?", "options": ["Nama saya...", "Selamat...", "Jumpa lagi", "Terima kasih"], "correct": 0 }
    ]
  }
}
```

- [ ] **Step 2: Create Lesson 2 — Food & Ordering**

```json
{
  "slug": "food-ordering",
  "title": "Food & Ordering",
  "description": "Learn how to order food and talk about meals.",
  "order": 2,
  "level": "beginner",
  "sections": {
    "vocabulary": ["makan", "minum", "nasi", "ayam", "air", "mahu", "tolong", "sedap"],
    "grammar": {
      "title": "Politeness with 'Tolong'",
      "explanation": "'Tolong' means 'please' or 'help' and is placed at the start of a request. 'Mahu' means 'want' and is less formal than 'hendak'.",
      "examples": [
        { "malay": "Tolong bagi saya nasi.", "english": "Please give me rice." },
        { "malay": "Saya mahu air kosong.", "english": "I want plain water." }
      ]
    },
    "dialogue": [
      { "speaker": "Pelanggan", "malay": "Selamat petang. Saya mahu nasi ayam.", "english": "Good evening. I want chicken rice." },
      { "speaker": "Pekerja", "malay": "Mahu minum apa?", "english": "What would you like to drink?" },
      { "speaker": "Pelanggan", "malay": "Air kosong, tolong.", "english": "Plain water, please." },
      { "speaker": "Pekerja", "malay": "Sama ada apa-apa lagi?", "english": "Anything else?" },
      { "speaker": "Pelanggan", "malay": "Itu sahaja. Berapa semuanya?", "english": "That's all. How much is everything?" }
    ],
    "exercise": [
      { "question": "How do you say 'I want chicken rice'?", "options": ["Saya suka nasi ayam", "Saya mahu nasi ayam", "Saya ada nasi ayam", "Saya makan nasi ayam"], "correct": 1 },
      { "question": "What does 'Tolong' mean in a request?", "options": ["Thank you", "Sorry", "Please", "Help (both)"], "correct": 3 },
      { "question": "How do you ask for the bill?", "options": ["Berapa harga", "Berapa semuanya", "Tolong bayar", "Mahu bayar"], "correct": 1 }
    ]
  }
}
```

- [ ] **Step 3: Create Lesson 3 — Family & Descriptions**

```json
{
  "slug": "family-descriptions",
  "title": "Family & Descriptions",
  "description": "Talk about your family members and describe people.",
  "order": 3,
  "level": "beginner",
  "sections": {
    "vocabulary": ["ibu", "bapa", "abang", "kakak", "adik", "besar", "kecil", "tinggi", "pendek"],
    "grammar": {
      "title": "Describing with 'Adalah' and Word Order",
      "explanation": "In Malay, adjectives follow nouns directly (like French/Spanish). 'Adalah' is optional for formal definitions.",
      "examples": [
        { "malay": "Rumah besar.", "english": "A big house / The house is big." },
        { "malay": "Dia adalah guru saya.", "english": "He is my teacher." }
      ]
    },
    "dialogue": [
      { "speaker": "Aminah", "malay": "Ini gambar keluarga saya.", "english": "This is my family photo." },
      { "speaker": "John", "malay": "Wah, besar keluarga awak! Siapa ini?", "english": "Wow, your family is big! Who is this?" },
      { "speaker": "Aminah", "malay": "Ini ibu dan bapa saya. Mereka sudah tua.", "english": "This is my mother and father. They are old." },
      { "speaker": "John", "malay": "Abang awak tinggi sekali!", "english": "Your older brother is very tall!" },
      { "speaker": "Aminah", "malay": "Ya, dia tinggi. Adik saya pula pendek.", "english": "Yes, he is tall. My younger sibling however is short." }
    ],
    "exercise": [
      { "question": "How do you say 'my mother'?", "options": ["Ibu saya", "Saya ibu", "Ibu awak", "Dia ibu"], "correct": 0 },
      { "question": "What is the word order for 'big house'?", "options": ["Besar rumah", "Rumah besar", "Rumah adalah besar", "Besar adalah rumah"], "correct": 1 },
      { "question": "What does 'Mereka sudah tua' mean?", "options": ["They are young", "They are old", "They are tall", "They are short"], "correct": 1 }
    ]
  }
}
```

- [ ] **Step 4: Validate all JSON files**

### Task 13: Grammar content files

**Files:**
- Create: `content/grammar/01-pronouns.json`
- Create: `content/grammar/02-sentence-structure.json`

- [ ] **Step 1: Create pronouns grammar topic**

```json
{
  "slug": "pronouns",
  "title": "Personal Pronouns",
  "category": "basics",
  "explanation": "Malay personal pronouns are simpler than English. 'Saya' is used in formal and informal contexts. 'Awak' and 'Kamu' are informal 'you'. 'Dia' covers both 'he' and 'she'.",
  "rules": [
    "No gender distinction for third person (dia = he/she)",
    "'Kita' means 'we' (inclusive, includes listener)",
    "'Kami' means 'we' (exclusive, excludes listener)",
    "Plural can be formed by adding 'mereka' or reduplication"
  ],
  "examples": [
    { "malay": "Saya suka kopi.", "english": "I like coffee." },
    { "malay": "Awak dari mana?", "english": "Where are you from?" },
    { "malay": "Dia pergi ke pasar.", "english": "He/She goes to the market." },
    { "malay": "Kami makan bersama.", "english": "We (excl.) eat together." },
    { "malay": "Kita semua rakyat Malaysia.", "english": "We (incl.) are all Malaysians." }
  ],
  "commonMistakes": [
    { "mistake": "Using 'kita' when you mean 'kami'", "fix": "'Kita' includes the listener, 'kami' excludes them" },
    { "mistake": "Using 'dia' for plural", "fix": "Use 'mereka' for 'they'" }
  ]
}
```

- [ ] **Step 2: Create sentence structure grammar topic**

```json
{
  "slug": "sentence-structure",
  "title": "Basic Sentence Structure",
  "category": "basics",
  "explanation": "Malay follows Subject-Verb-Object (SVO) order, similar to English. However, there are no tenses (time is indicated by context or time words), no articles, and no plural conjugation.",
  "rules": [
    "SVO word order: Subject + Verb + Object",
    "Adjectives follow nouns: rumah besar (house big)",
    "Negation: 'tidak' for verbs/adjectives, 'bukan' for nouns",
    "Questions: just add 'kah' or use question words (apa, siapa, mana)"
  ],
  "examples": [
    { "malay": "Saya makan nasi.", "english": "I eat rice." },
    { "malay": "Dia tidak suka pedas.", "english": "He/She doesn't like spicy." },
    { "malay": "Itu bukan buku saya.", "english": "That is not my book." },
    { "malay": "Awak mahu pergi ke mana?", "english": "Where do you want to go?" }
  ],
  "commonMistakes": [
    { "mistake": "Adding 'adalah' everywhere like 'is' in English", "fix": "'Adalah' is only used for formal definitions, not everyday sentences" },
    { "mistake": "Conjugating verbs for tense", "fix": "Malay verbs don't change. Use time words (sudah, akan, sedang)" }
  ]
}
```

- [ ] **Step 3: Validate JSON files**

### Task 14: Culture content files

**Files:**
- Create: `content/culture/01-greetings.json`
- Create: `content/culture/02-festivals.json`

- [ ] **Step 1: Create greetings culture topic**

```json
{
  "slug": "greetings-etiquette",
  "title": "Greetings & Etiquette",
  "category": "social",
  "content": "Malaysian greetings are warm but follow specific cultural norms. The 'salam' (handshake) is done with both hands for Muslims, especially with elders. Always use titles (Encik, Puan, Cik) unless invited to use first names.",
  "tips": [
    "Greet elders first when entering a room",
    "Use right hand for giving and receiving",
    "Bowing slightly when greeting elders shows respect",
    "Never point with your index finger — use your thumb"
  ],
  "phrases": [
    { "situation": "Morning greeting", "malay": "Selamat pagi", "english": "Good morning" },
    { "situation": "When meeting someone", "malay": "Selamat berkenalan", "english": "Nice to meet you" },
    { "situation": "When leaving", "malay": "Selamat tinggal", "english": "Goodbye (said by person leaving)" },
    { "situation": "When being left", "malay": "Selamat jalan", "english": "Goodbye (said to person leaving)" }
  ]
}
```

- [ ] **Step 2: Create festivals culture topic**

```json
{
  "slug": "festivals",
  "title": "Major Festivals",
  "category": "celebrations",
  "content": "Malaysia is multicultural with three major festivals: Hari Raya Aidilfitri (marking end of Ramadan), Chinese New Year, and Deepavali. 'Maaf zahir dan batin' is the apology phrase used during Hari Raya, meaning 'forgive me physically and spiritually'.",
  "tips": [
    "Open house is a Malaysian tradition during festivals — anyone is welcome",
    "Green packets (duit raya) are given during Hari Raya, red packets (ang pao) during CNY",
    "'Selamat Hari Raya' is the greeting for Eid"
  ],
  "phrases": [
    { "situation": "Eid greeting", "malay": "Selamat Hari Raya", "english": "Happy Eid" },
    { "situation": "Eid apology phrase", "malay": "Maaf zahir dan batin", "english": "Forgive me (physically and spiritually)" },
    { "situation": "Chinese New Year", "malay": "Selamat Tahun Baru Cina", "english": "Happy Chinese New Year" },
    { "situation": "Deepavali", "malay": "Selamat Deepavali", "english": "Happy Deepavali" }
  ]
}
```

- [ ] **Step 3: Validate JSON files**

### Task 15: Seed script

**Files:**
- Create: `content/seed.ts`

- [ ] **Step 1: Write the seed script**

```typescript
import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import { db, schema } from "@malay/db";

async function seed() {
  console.log("Seeding from content files...");

  // Clear existing data in dependency order
  await db.delete(schema.srsData);
  await db.delete(schema.userProgress);
  await db.delete(schema.lessons);
  await db.delete(schema.vocabulary);

  // Seed vocabulary
  const vocabDir = join(__dirname, "vocabulary");
  const files = readdirSync(vocabDir).sort();
  for (const file of files) {
    const data = JSON.parse(readFileSync(join(vocabDir, file), "utf8"));
    const words = data.words.map((w: any) => ({
      malay: w.malay,
      english: w.english,
      category: data.topicEnglish.toLowerCase().replace(/\s+/g, "-"),
      topic: data.topic,
      exampleSentence: w.exampleSentence,
      exampleEnglish: w.exampleEnglish,
      difficulty: "beginner" as const,
    }));
    await db.insert(schema.vocabulary).values(words);
    console.log(`  ${data.topic}: ${words.length} words`);
  }

  // Seed lessons
  const lessonDir = join(__dirname, "lessons");
  const lessonFiles = readdirSync(lessonDir).sort();
  for (const file of lessonFiles) {
    const lesson = JSON.parse(readFileSync(join(lessonDir, file), "utf8"));
    await db.insert(schema.lessons).values({
      slug: lesson.slug,
      title: lesson.title,
      description: lesson.description,
      order: lesson.order,
      level: lesson.level,
      sections: lesson.sections,
    });
    console.log(`  Lesson: ${lesson.title}`);
  }

  // Grammar and culture are loaded from JSON by the UI pages directly
  // (content/grammar/ and content/culture/ are for reference)

  console.log("Seed complete!");
}

seed().catch(console.error);
```

- [ ] **Step 2: Add seed script to root package.json**

In `package.json`, add script:
```json
"seed": "npx tsx content/seed.ts"
```

- [ ] **Step 3: Run the seed script**

```bash
npx tsx content/seed.ts
```

Expected output:
```
Seeding from content files...
  Nombor: 15 words
  Makanan & Minuman: 25 words
  Keluarga: 15 words
  Tempat & Arah: 20 words
  Masa & Cuaca: 20 words
  Belanja: 20 words
  Pengangkutan: 20 words
  Kerjaya: 20 words
  Kesihatan: 25 words
  Aktiviti Harian: 20 words
  Lesson: Greetings & Introductions
  Lesson: Food & Ordering
  Lesson: Family & Descriptions
Seed complete!
```

- [ ] **Step 4: Verify in app**

1. Start the dev server: `cd apps/web && npx next dev`
2. Go to `/dashboard/lessons` — should show 3 lessons
3. Click a lesson — should show vocab, grammar, dialogue, exercises
4. Go to `/dashboard/grammar` — should show grammar topics
5. Go to `/dashboard/culture` — should show cultural content

### Task 16: Remove old seed data

**Files:**
- Modify: `packages/db/src/seed.ts` (or remove if no longer used)

- [ ] **Step 1: Keep or remove old seed script**

The old `packages/db/src/seed.ts` is now redundant. Either remove it or update it to proxy to `content/seed.ts`. Recommend removing it to avoid confusion.

- [ ] **Step 2: Update package.json seed reference**

Update `packages/db/package.json` if it has its own seed script.

### Task 17: Commit

- [ ] **Step 1: Commit all content and seed changes**

```bash
git add content/ packages/db/src/seed.ts
git commit -m "feat: content system with 200 vocabulary words, 3 lessons, grammar and culture content"
```

---

## Summary

| Task | Description | Files | Dependencies |
|------|-------------|-------|-------------|
| 1 | Directory structure | 4 dirs | None |
| 2-11 | Vocabulary JSON (10 files) | 10 files | Task 1 |
| 12 | Lesson JSON (3 files) | 3 files | Task 1 |
| 13 | Grammar JSON (2 files) | 2 files | Task 1 |
| 14 | Culture JSON (2 files) | 2 files | Task 1 |
| 15 | Seed script | 1 file | Tasks 2-14 |
| 16 | Cleanup | 1 file modified | Task 15 |
| 17 | Commit | — | Tasks 2-16 |
