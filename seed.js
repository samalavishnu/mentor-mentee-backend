/**
 * Seed Script — run once: node seed.js
 * Creates demo accounts for all roles.
 * Uses User.create() which triggers bcrypt pre-save hook automatically.
 */
const mongoose  = require('mongoose');
const User      = require('./models/User');
const MentorProfile    = require('./models/MentorProfile');
const PlatformSettings = require('./models/PlatformSettings');
require('dotenv').config();

const SEED_USERS = [
  { name: 'Admin User',   email: 'admin@demo.com',       password: 'admin1', role: 'admin'      },
  { name: 'John Mentor',  email: 'mentor@demo.com',      password: 'mentor123', role: 'mentor'     },
  { name: 'Jane Mentee',  email: 'mentee@demo.com',      password: 'mentee456', role: 'mentee'     },
];

const seed = async () => {
  try {
    await mongoose.connect('mongodb://mentor_Mentee:mentor-mente-db@ac-mgjt3ud-shard-00-00.cnzm2ds.mongodb.net:27017,ac-mgjt3ud-shard-00-01.cnzm2ds.mongodb.net:27017,ac-mgjt3ud-shard-00-02.cnzm2ds.mongodb.net:27017/?ssl=true&replicaSet=atlas-kkzjm9-shard-0&authSource=admin&appName=Cluster0');
    console.log('🔌 Connected to MongoDB\n');

    for (const u of SEED_USERS) {
      const exists = await User.findOne({ email: u.email });

      if (exists) {
        console.log(`⚠️  [${u.role.padEnd(10)}] ${u.email} — already exists, skipped`);
        continue;
      }

      // User.create() triggers pre-save → bcrypt hash automatically
      // DO NOT manually hash here — that would cause double-hashing
      const created = await User.create({
        name:     u.name,
        email:    u.email,
        password: u.password,   // plain text — model hashes it
        role:     u.role,
        isActive: true,
      });

      console.log(`✅ Created [${u.role.padEnd(10)}] ${u.email}`);

      if (u.role === 'mentor') {
        await MentorProfile.create({
          user:            created._id,
          skills:          ['React', 'Node.js', 'System Design', 'JavaScript'],
          experience:      5,
          title:           'Senior Software Engineer',
          company:         'Demo Corp',
          availability:    'available',
          hourlyRate:      500,
          upiId:           'mentor@paytm',
          paymentRequired: false,
        });
        console.log(`   └─ MentorProfile created`);
      }
    }

    // Ensure platform settings singleton exists
    await PlatformSettings.getSettings();
    console.log('\n✅ Platform settings initialized');

    console.log('\n' + '═'.repeat(50));
    console.log('🎉 Seeding complete!\n');
    console.log('─'.repeat(50));
    console.log('  🛡️  Admin       → admin@demo.com');
    console.log('  🧑‍🏫 Mentor      → mentor@demo.com');
    console.log('  🎓 Mentee      → mentee@demo.com');
    console.log('─'.repeat(50));
    console.log('\nAdmin login → http://localhost:3000/login');
    console.log('After login → auto-redirected to /dashboard\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
};

seed();
