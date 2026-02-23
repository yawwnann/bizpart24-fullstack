import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearDatabase() {
  console.log('🗑️  Menghapus semua data dari database...\n');

  try {
    // Delete in correct order (respecting foreign key constraints)
    await prisma.product.deleteMany({});
    console.log('✅ Products dihapus');

    await prisma.order.deleteMany({});
    console.log('✅ Orders dihapus');

    await prisma.category.deleteMany({});
    console.log('✅ Categories dihapus');

    await prisma.make.deleteMany({});
    console.log('✅ Makes dihapus');

    await prisma.model.deleteMany({});
    console.log('✅ Models dihapus');

    await prisma.admin.deleteMany({});
    console.log('✅ Admins dihapus');

    console.log('\n🎉 Database berhasil dikosongkan!');
  } catch (error) {
    console.error('❌ Error saat menghapus data:', error);
    process.exit(1);
  }
}

clearDatabase()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
