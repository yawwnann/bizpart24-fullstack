import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import slugify from 'slugify';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Mulai seeding database...\n');

  // ========================
  // 1. ADMIN
  // ========================
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('admin123', salt);

  const admin = await prisma.admin.upsert({
    where: { email: 'admin@bizsparepart24.com' },
    update: {},
    create: {
      email: 'admin@bizsparepart24.com',
      password: hashedPassword,
    },
  });
  console.log('✅ Admin dibuat:', admin.email);

  // ========================
  // 2. CATEGORIES
  // ========================
  const categoryNames = [
    'Mesin',
    'Rem',
    'Suspensi',
    'Kelistrikan',
    'Body & Eksterior',
    'Interior',
    'Filter',
    'Oli & Cairan',
    'Transmisi',
    'Knalpot',
  ];

  const categories: Record<string, any> = {};
  for (const name of categoryNames) {
    const slug = slugify(name, { lower: true, strict: true });
    const cat = await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name, slug },
    });
    categories[name] = cat;
  }
  console.log(`✅ ${categoryNames.length} kategori dibuat`);

  // ========================
  // 3. MAKES (Merek Mobil)
  // ========================
  const makeNames = [
    'Toyota',
    'Honda',
    'Suzuki',
    'Daihatsu',
    'Mitsubishi',
    'Nissan',
    'Hyundai',
    'Wuling',
  ];

  const makes: Record<string, any> = {};
  for (const name of makeNames) {
    const slug = slugify(name, { lower: true, strict: true });
    const make = await prisma.make.upsert({
      where: { name },
      update: {},
      create: { name, slug },
    });
    makes[name] = make;
  }
  console.log(`✅ ${makeNames.length} merek dibuat`);

  // ========================
  // 4. MODELS
  // ========================
  const modelNames = [
    'Avanza',
    'Innova',
    'Fortuner',
    'Yaris',
    'Raize',
    'Brio',
    'HR-V',
    'CR-V',
    'Civic',
    'Jazz',
    'Ertiga',
    'XL7',
    'Jimny',
    'Swift',
    'Xenia',
    'Terios',
    'Ayla',
    'Sigra',
    'Xpander',
    'Pajero Sport',
    'Triton',
    'Outlander',
    'Livina',
    'Kicks',
    'X-Trail',
    'March',
    'Creta',
    'Stargazer',
    'Almaz',
    'Confero',
  ];

  const models: Record<string, any> = {};
  for (const name of modelNames) {
    const slug = slugify(name, { lower: true, strict: true });
    const model = await prisma.model.upsert({
      where: { name },
      update: {},
      create: { name, slug },
    });
    models[name] = model;
  }
  console.log(`✅ ${modelNames.length} model dibuat`);

  // ========================
  // 5. PRODUCTS
  // ========================
  const products = [
    // Mesin
    {
      name: 'Kampas Kopling Set Toyota Avanza 1.3',
      price: 850000,
      description: 'Kampas kopling set lengkap (disc, cover, bearing) untuk Toyota Avanza 1.3L. Original quality, tahan lama hingga 60.000 km.',
      image: 'https://res.cloudinary.com/demo/image/upload/v1/products/clutch-set.jpg',
      stock: 25,
      year: 2022,
      category: 'Mesin',
      make: 'Toyota',
      model: 'Avanza',
    },
    {
      name: 'Timing Belt Kit Honda Brio',
      price: 650000,
      description: 'Timing belt kit komplit dengan tensioner dan idle pulley. Cocok untuk Honda Brio 1.2L. Disarankan ganti setiap 80.000 km.',
      image: 'https://res.cloudinary.com/demo/image/upload/v1/products/timing-belt.jpg',
      stock: 15,
      year: 2023,
      category: 'Mesin',
      make: 'Honda',
      model: 'Brio',
    },
    {
      name: 'Piston Ring Set Suzuki Ertiga',
      price: 420000,
      description: 'Ring piston set untuk Suzuki Ertiga 1.5L. Material high-grade cast iron, presisi tinggi.',
      image: 'https://res.cloudinary.com/demo/image/upload/v1/products/piston-ring.jpg',
      stock: 10,
      year: 2021,
      category: 'Mesin',
      make: 'Suzuki',
      model: 'Ertiga',
    },

    // Rem
    {
      name: 'Brake Pad Depan Toyota Innova',
      price: 350000,
      description: 'Kampas rem depan ceramic untuk Toyota Innova. Performa pengereman optimal, minim debu, dan tidak berisik.',
      image: 'https://res.cloudinary.com/demo/image/upload/v1/products/brake-pad.jpg',
      stock: 40,
      year: 2023,
      category: 'Rem',
      make: 'Toyota',
      model: 'Innova',
    },
    {
      name: 'Disc Brake Rotor Honda HR-V',
      price: 750000,
      description: 'Piringan rem / disc brake rotor depan untuk Honda HR-V. Ventilated disc, anti-warp technology.',
      image: 'https://res.cloudinary.com/demo/image/upload/v1/products/disc-rotor.jpg',
      stock: 12,
      year: 2022,
      category: 'Rem',
      make: 'Honda',
      model: 'HR-V',
    },
    {
      name: 'Master Rem Daihatsu Xenia',
      price: 480000,
      description: 'Master cylinder rem untuk Daihatsu Xenia. Kualitas OEM replacement, sudah termasuk reservoir.',
      image: 'https://res.cloudinary.com/demo/image/upload/v1/products/master-rem.jpg',
      stock: 8,
      year: 2021,
      category: 'Rem',
      make: 'Daihatsu',
      model: 'Xenia',
    },

    // Suspensi
    {
      name: 'Shock Absorber Depan Mitsubishi Xpander',
      price: 550000,
      description: 'Shock absorber depan gas-filled untuk Mitsubishi Xpander. Memberikan kenyamanan dan stabilitas berkendara.',
      image: 'https://res.cloudinary.com/demo/image/upload/v1/products/shock-absorber.jpg',
      stock: 20,
      year: 2023,
      category: 'Suspensi',
      make: 'Mitsubishi',
      model: 'Xpander',
    },
    {
      name: 'Ball Joint Bawah Toyota Fortuner',
      price: 280000,
      description: 'Ball joint lower arm untuk Toyota Fortuner. Heavy duty, cocok untuk penggunaan off-road.',
      image: 'https://res.cloudinary.com/demo/image/upload/v1/products/ball-joint.jpg',
      stock: 18,
      year: 2022,
      category: 'Suspensi',
      make: 'Toyota',
      model: 'Fortuner',
    },
    {
      name: 'Bushing Arm Nissan Livina',
      price: 120000,
      description: 'Bushing lower arm Nissan Livina. Material polyurethane berkualitas tinggi, tahan lama.',
      image: 'https://res.cloudinary.com/demo/image/upload/v1/products/bushing.jpg',
      stock: 30,
      year: 2020,
      category: 'Suspensi',
      make: 'Nissan',
      model: 'Livina',
    },

    // Kelistrikan
    {
      name: 'Alternator Honda Civic',
      price: 2850000,
      description: 'Alternator / dinamo ampere Honda Civic. Output 90A, reconditioned berkualitas tinggi.',
      image: 'https://res.cloudinary.com/demo/image/upload/v1/products/alternator.jpg',
      stock: 5,
      year: 2022,
      category: 'Kelistrikan',
      make: 'Honda',
      model: 'Civic',
    },
    {
      name: 'Busi Iridium Toyota Yaris Set 4pcs',
      price: 320000,
      description: 'Busi iridium set 4 pcs untuk Toyota Yaris. Pembakaran lebih efisien, umur pemakaian lebih panjang.',
      image: 'https://res.cloudinary.com/demo/image/upload/v1/products/spark-plug.jpg',
      stock: 50,
      year: 2023,
      category: 'Kelistrikan',
      make: 'Toyota',
      model: 'Yaris',
    },
    {
      name: 'Starter Motor Suzuki Swift',
      price: 1500000,
      description: 'Dinamo starter Suzuki Swift 1.5L. Rebuild quality, garansi 6 bulan.',
      image: 'https://res.cloudinary.com/demo/image/upload/v1/products/starter-motor.jpg',
      stock: 7,
      year: 2021,
      category: 'Kelistrikan',
      make: 'Suzuki',
      model: 'Swift',
    },

    // Filter
    {
      name: 'Filter Udara Toyota Raize',
      price: 85000,
      description: 'Air filter / saringan udara Toyota Raize. Material cotton-gauze, filtrasi optimal.',
      image: 'https://res.cloudinary.com/demo/image/upload/v1/products/air-filter.jpg',
      stock: 60,
      year: 2023,
      category: 'Filter',
      make: 'Toyota',
      model: 'Raize',
    },
    {
      name: 'Filter Oli Daihatsu Sigra',
      price: 45000,
      description: 'Oil filter Daihatsu Sigra. Disarankan ganti setiap penggantian oli mesin.',
      image: 'https://res.cloudinary.com/demo/image/upload/v1/products/oil-filter.jpg',
      stock: 80,
      year: 2022,
      category: 'Filter',
      make: 'Daihatsu',
      model: 'Sigra',
    },
    {
      name: 'Filter AC Hyundai Creta',
      price: 95000,
      description: 'Cabin air filter / filter AC Hyundai Creta. Anti-bacterial, menjaga udara kabin tetap bersih.',
      image: 'https://res.cloudinary.com/demo/image/upload/v1/products/cabin-filter.jpg',
      stock: 35,
      year: 2023,
      category: 'Filter',
      make: 'Hyundai',
      model: 'Creta',
    },

    // Oli & Cairan
    {
      name: 'Oli Mesin 5W-30 Fully Synthetic 4L',
      price: 380000,
      description: 'Oli mesin fully synthetic 5W-30, cocok untuk semua tipe mobil. API SN Plus, perlindungan maksimal.',
      image: 'https://res.cloudinary.com/demo/image/upload/v1/products/engine-oil.jpg',
      stock: 100,
      year: 2024,
      category: 'Oli & Cairan',
      make: 'Toyota',
      model: 'Avanza',
    },
    {
      name: 'Minyak Rem DOT 4 500ml',
      price: 65000,
      description: 'Brake fluid DOT 4 untuk semua tipe kendaraan. Titik didih tinggi, performa stabil.',
      image: 'https://res.cloudinary.com/demo/image/upload/v1/products/brake-fluid.jpg',
      stock: 70,
      year: 2024,
      category: 'Oli & Cairan',
      make: 'Honda',
      model: 'Jazz',
    },

    // Body & Eksterior
    {
      name: 'Headlamp Kiri Wuling Almaz',
      price: 3200000,
      description: 'Lampu depan kiri Wuling Almaz. LED projector, kualitas aftermarket premium.',
      image: 'https://res.cloudinary.com/demo/image/upload/v1/products/headlamp.jpg',
      stock: 4,
      year: 2023,
      category: 'Body & Eksterior',
      make: 'Wuling',
      model: 'Almaz',
    },
    {
      name: 'Spion Elektrik Kanan Hyundai Stargazer',
      price: 950000,
      description: 'Kaca spion elektrik kanan Hyundai Stargazer, lengkap dengan cover dan motor. Warna hitam polos (bisa dicat).',
      image: 'https://res.cloudinary.com/demo/image/upload/v1/products/side-mirror.jpg',
      stock: 6,
      year: 2023,
      category: 'Body & Eksterior',
      make: 'Hyundai',
      model: 'Stargazer',
    },
    {
      name: 'Bumper Depan Daihatsu Terios',
      price: 1800000,
      description: 'Bumper depan Daihatsu Terios. Material PP plastic, siap cat, termasuk bracket.',
      image: 'https://res.cloudinary.com/demo/image/upload/v1/products/bumper.jpg',
      stock: 3,
      year: 2022,
      category: 'Body & Eksterior',
      make: 'Daihatsu',
      model: 'Terios',
    },

    // Transmisi
    {
      name: 'Oli Transmisi Matic ATF 1L',
      price: 150000,
      description: 'Automatic transmission fluid untuk mobil matic. Kompatibel dengan Dexron III dan Mercon V.',
      image: 'https://res.cloudinary.com/demo/image/upload/v1/products/atf-oil.jpg',
      stock: 45,
      year: 2024,
      category: 'Transmisi',
      make: 'Mitsubishi',
      model: 'Pajero Sport',
    },
    {
      name: 'CV Joint Dalam Suzuki XL7',
      price: 680000,
      description: 'Inner CV joint / kopel dalam Suzuki XL7. Sudah termasuk boot dan grease.',
      image: 'https://res.cloudinary.com/demo/image/upload/v1/products/cv-joint.jpg',
      stock: 10,
      year: 2022,
      category: 'Transmisi',
      make: 'Suzuki',
      model: 'XL7',
    },

    // Knalpot
    {
      name: 'Muffler / Knalpot Belakang Nissan Kicks',
      price: 1200000,
      description: 'Knalpot belakang / rear muffler Nissan Kicks. Stainless steel, suara halus.',
      image: 'https://res.cloudinary.com/demo/image/upload/v1/products/muffler.jpg',
      stock: 6,
      year: 2023,
      category: 'Knalpot',
      make: 'Nissan',
      model: 'Kicks',
    },
    {
      name: 'Catalytic Converter Honda CR-V',
      price: 4500000,
      description: 'Catalytic converter Honda CR-V. Lolos uji emisi, material keramik berkualitas tinggi.',
      image: 'https://res.cloudinary.com/demo/image/upload/v1/products/catalytic.jpg',
      stock: 3,
      year: 2022,
      category: 'Knalpot',
      make: 'Honda',
      model: 'CR-V',
    },

    // Interior
    {
      name: 'Kaca Spion Dalam Wuling Confero',
      price: 180000,
      description: 'Kaca spion dalam / rear view mirror Wuling Confero. Anti silau, mudah dipasang.',
      image: 'https://res.cloudinary.com/demo/image/upload/v1/products/rearview-mirror.jpg',
      stock: 15,
      year: 2022,
      category: 'Interior',
      make: 'Wuling',
      model: 'Confero',
    },
    {
      name: 'Handle Pintu Dalam Daihatsu Ayla',
      price: 75000,
      description: 'Handle tarikan pintu dalam Daihatsu Ayla, warna hitam. Material plastik ABS kuat.',
      image: 'https://res.cloudinary.com/demo/image/upload/v1/products/door-handle.jpg',
      stock: 20,
      year: 2021,
      category: 'Interior',
      make: 'Daihatsu',
      model: 'Ayla',
    },
  ];

  let productCount = 0;
  for (const p of products) {
    await prisma.product.create({
      data: {
        name: p.name,
        price: p.price,
        description: p.description,
        image: p.image,
        stock: p.stock,
        year: p.year,
        categoryId: categories[p.category].id,
        makeId: makes[p.make].id,
        modelId: models[p.model].id,
      },
    });
    productCount++;
  }
  console.log(`✅ ${productCount} produk dibuat`);

  console.log('\n🎉 Seeding selesai!');
  console.log('   Admin login: admin@bizsparepart24.com / admin123');
}

main()
  .catch((e) => {
    console.error('❌ Error saat seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
