import psycopg2
import json

DB_URL = "postgresql://postgres:koksyr-ryvvyn-cantI0@db.zzudouifhwqapqsnlard.supabase.co:5432/postgres"

# Emerald Cut
ec_videos = [{"public_id": "Gemstone Videos/Alexandrite/shape-emeraldCut/grade-Lab/IMG_0192_t7hlzd_mp4", "video_url": "https://res.cloudinary.com/dabdvgxd4/video/upload/v1787172085/Gemstone%20Videos/Alexandrite/shape-emeraldCut/grade-Lab/IMG_0192_t7hlzd_mp4.mp4"}, {"public_id": "Gemstone Videos/Alexandrite/shape-emeraldCut/grade-Lab/IMG_0195_wil1fw_mp4", "video_url": "https://res.cloudinary.com/dabdvgxd4/video/upload/v1787172087/Gemstone%20Videos/Alexandrite/shape-emeraldCut/grade-Lab/IMG_0195_wil1fw_mp4.mp4"}]
ec_image = "https://res.cloudinary.com/dabdvgxd4/image/upload/v1755717220/IMG_2122_cygncf.png"

# Oval
oval_videos = [{"public_id": "Gemstone Videos/Alexandrite/shape-oval/grade-Lab/IMG_0197_hrxh0b_mp4", "video_url": "https://res.cloudinary.com/dabdvgxd4/video/upload/v1787172088/Gemstone%20Videos/Alexandrite/shape-oval/grade-Lab/IMG_0197_hrxh0b_mp4.mp4"}]
oval_image = "https://res.cloudinary.com/dabdvgxd4/image/upload/v1755717219/IMG_2023_qdh9ax.png"

conn = psycopg2.connect(DB_URL)
cur = conn.cursor()

try:
    # Insert Emerald Cut
    cur.execute("""
        INSERT INTO gemstone_specs 
        (collection_slug, shape, size, ct_weight, cut, quality, price, type, color, image_url, cloudinary_videos, is_available, search_vector)
        VALUES 
        (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, to_tsvector('english', %s))
        RETURNING id;
    """, (
        'Alexandrite', 'Emerald Cut', '4.00 x 3.00 mm', 0.20, 'Step-cut', 'Lab Grown', 17.00, 'Lab Grown', 'Green - Purple', ec_image, json.dumps(ec_videos), True, 'Alexandrite Emerald Cut 4.00 x 3.00 mm Lab Grown Green - Purple Step-cut'
    ))
    print("Inserted EC:", cur.fetchone())

    # Insert Oval
    cur.execute("""
        INSERT INTO gemstone_specs 
        (collection_slug, shape, size, ct_weight, cut, quality, price, type, color, image_url, cloudinary_videos, is_available, search_vector)
        VALUES 
        (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, to_tsvector('english', %s))
        RETURNING id;
    """, (
        'Alexandrite', 'Oval', '4.00 x 3.00 mm', 0.20, 'Faceted', 'Lab Grown', 17.00, 'Lab Grown', 'Green - Purple', oval_image, json.dumps(oval_videos), True, 'Alexandrite Oval 4.00 x 3.00 mm Lab Grown Green - Purple Faceted'
    ))
    print("Inserted Oval:", cur.fetchone())

    conn.commit()
    print("Commit successful!")
except Exception as e:
    conn.rollback()
    print("Error:", e)
finally:
    cur.close()
    conn.close()
