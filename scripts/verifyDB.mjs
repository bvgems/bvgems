import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

async function verify() {
  const oldUrls = [
    'https://res.cloudinary.com/oko8ywzn/image/upload/v1792431936/Gemstone%20Shapes/Alexandrite/Green-Purple/Lab_Grown/alexandrite-green-purple-lab-grown-lab-grown-oval.png',
    'https://res.cloudinary.com/oko8ywzn/image/upload/v1792431946/Gemstone%20Shapes/Citrine/Orange/AA/citrine-orange-natural-aa-oval.png',
    'https://res.cloudinary.com/oko8ywzn/image/upload/v1792431951/Gemstone%20Shapes/Emerald/Green/A/emerald-green-natural-a-oval.png',
    'https://res.cloudinary.com/oko8ywzn/image/upload/v1792431984/Gemstone%20Shapes/Sapphire/Blue/A/sapphire-blue-natural-a-oval.png',
    'https://res.cloudinary.com/oko8ywzn/image/upload/v1792432000/Gemstone%20Shapes/Sapphire/Purple/A/sapphire-purple-natural-a-oval.png',
    'https://res.cloudinary.com/oko8ywzn/image/upload/v1792432005/Gemstone%20Shapes/Sapphire/Red/A/sapphire-red-natural-a-oval.png'
  ];

  const res = await pool.query('SELECT count(*) FROM gemstone_specs WHERE image_url = ANY($1)', [oldUrls]);
  console.log('Old horizontal URLs remaining in DB:', res.rows[0].count);

  const newUrls = [
    'https://res.cloudinary.com/oko8ywzn/image/upload/v1792437334/Gemstone%20Shapes/Alexandrite/Green-Purple/Lab_Grown/alexandrite-green-purple-lab-grown-lab-grown-oval.png',
    'https://res.cloudinary.com/oko8ywzn/image/upload/v1792437335/Gemstone%20Shapes/Citrine/Orange/AA/citrine-orange-natural-aa-oval.png',
    'https://res.cloudinary.com/oko8ywzn/image/upload/v1792437336/Gemstone%20Shapes/Emerald/Green/A/emerald-green-natural-a-oval.png',
    'https://res.cloudinary.com/oko8ywzn/image/upload/v1792437337/Gemstone%20Shapes/Sapphire/Blue/A/sapphire-blue-natural-a-oval.png',
    'https://res.cloudinary.com/oko8ywzn/image/upload/v1792437338/Gemstone%20Shapes/Sapphire/Purple/A/sapphire-purple-natural-a-oval.png',
    'https://res.cloudinary.com/oko8ywzn/image/upload/v1792437340/Gemstone%20Shapes/Sapphire/Red/A/sapphire-red-natural-a-oval.png'
  ];

  const res2 = await pool.query('SELECT count(*) FROM gemstone_specs WHERE image_url = ANY($1)', [newUrls]);
  console.log('New vertical URLs active in DB:', res2.rows[0].count);

  await pool.end();
}

verify();
