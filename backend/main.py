from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from pathlib import Path
import sqlite3
import random
import string


# =========================================================
# KH FASHION API
# =========================================================

BASE_DIR = Path(__file__).resolve().parent
DB_FILE = BASE_DIR / "fashion.db"

CATALOG_VERSION = 3

app = FastAPI(
    title="KH Fashion API",
    version="3.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# CATEGORY
# =========================================================

CATEGORIES = [
    ("men-short", "👕 Men Short Sleeve", 40),
    ("men-long", "🧥 Men Long / Oversized", 40),
    ("women-short", "👚 Women Short Sleeve", 40),
    ("women-long", "👗 Women Long / Oversized", 40),
    ("beauty", "💄 Women Beauty", 40),
    ("shoes", "👟 Shoes", 40),
]


# =========================================================
# PEXELS IMAGE
# =========================================================

def pexels(photo_id):
    return (
        f"https://images.pexels.com/photos/{photo_id}/"
        f"pexels-photo-{photo_id}.jpeg"
        "?auto=compress&cs=tinysrgb&w=900&h=1100&fit=crop"
    )


# =========================================================
# MEN SHORT
# =========================================================

MEN_SHORT_IMAGES = [
    25890284,
    17503455,
    19451561,
    19223931,
    13051322,
    20155799,
    24301504,
    10423606,
    26225572,
    17503473,
    18285570,
    20279543,
    20587253,
    20425624,
    20155775,
    2322999,
    17806641,
    34946640,
    16664908,
    17575431,
]


# =========================================================
# MEN LONG / OVERSIZED
# =========================================================

MEN_LONG_IMAGES = [
    20279543,
    20425624,
    18285570,
    20587253,
    17503473,
    17503455,
    24301504,
    20155799,
    20155775,
    10423606,
    25890284,
    19451561,
    19223931,
    13051322,
    26225572,
    17806641,
    16664908,
    17575431,
    34946640,
    2322999,
]


# =========================================================
# WOMEN SHORT
# =========================================================

WOMEN_SHORT_IMAGES = [
    25471969,
    19069400,
    7516153,
    8053913,
    13049689,
    19601324,
    9619710,
    20379203,
    28079794,
    19551232,
    6593907,
    12446369,
    8249696,
    16826421,
    5886008,
    20095342,
    14947049,
    20414998,
    21610121,
]


# =========================================================
# WOMEN LONG
# =========================================================

WOMEN_LONG_IMAGES = [
    15262855,
    15262856,
    15262962,
    25471969,
    19069400,
    8053913,
    13049689,
    19601324,
    20379203,
    28079794,
    19551232,
    6593907,
    12446369,
    8249696,
    16826421,
    5886008,
    20095342,
    14947049,
    20414998,
    21610121,
]


# =========================================================
# BEAUTY
# =========================================================

BEAUTY_IMAGES = [
    30797184,
    16441680,
    30797180,
    30797174,
    30797176,
    30797182,
    30797187,
    34946659,
    34946664,
    15108316,
    28786316,
    6404,
    8450101,
    2369161,
    11383178,
    20318922,
]


# =========================================================
# SHOES
# =========================================================

SHOES_IMAGES = [
    20298288,
    13536939,
    10353778,
    6050929,
    11324518,
    2371935,
    11871919,
    27178861,
    5365554,
]


# =========================================================
# PRODUCT NAMES
# =========================================================

MEN_SHORT_NAMES = [
    "Seoul Classic Tee",
    "Tokyo Minimal Tee",
    "K-Style Black Tee",
    "Urban Korean Tee",
    "Seoul Street Tee",
    "Tokyo Basic Tee",
    "Modern Black T-Shirt",
    "Premium White Tee",
    "Daily Cotton Tee",
    "Minimal Grey Tee",
    "Classic Navy Tee",
    "Street Essential Tee",
    "Korean Casual Tee",
    "Asian Fit T-Shirt",
    "Modern Relaxed Tee",
    "Soft Cotton Tee",
    "Clean Style Tee",
    "Everyday Black Tee",
    "Urban White Tee",
    "Premium Casual Tee",
]


MEN_LONG_NAMES = [
    "Korean Oversized Shirt",
    "Seoul Relaxed Shirt",
    "Tokyo Oversized Shirt",
    "Japanese Casual Shirt",
    "Seoul Long Sleeve",
    "Urban Oversized Shirt",
    "Minimal Long Shirt",
    "Premium Linen Shirt",
    "K-Style Oversized Top",
    "Tokyo Street Shirt",
    "Modern Long Sleeve",
    "Relaxed Fit Shirt",
    "Asian Street Overshirt",
    "Classic Oversized Shirt",
    "Soft Long Sleeve",
    "Premium Oversized Top",
    "Seoul Daily Shirt",
    "Tokyo Relaxed Shirt",
    "Modern Korean Shirt",
    "Urban Long Sleeve",
]


WOMEN_SHORT_NAMES = [
    "Tokyo Girl Tee",
    "Seoul Soft Top",
    "Minimal Pink Tee",
    "Korean Daily Tee",
    "Soft Cotton Top",
    "Modern Girl T-Shirt",
    "Seoul Basic Tee",
    "Tokyo Casual Top",
    "Clean White Tee",
    "Pastel Daily Top",
    "Asian Style Tee",
    "Modern Crop Tee",
    "Simple Fashion Tee",
    "Soft Summer Top",
    "Elegant Casual Tee",
    "Daily Comfort Top",
    "Seoul Street Top",
    "Tokyo Minimal Top",
    "Premium Girl Tee",
    "Modern Basic Top",
]


WOMEN_LONG_NAMES = [
    "Seoul Oversized Blouse",
    "Tokyo Elegant Shirt",
    "Korean Long Blouse",
    "Japanese Daily Shirt",
    "Soft Oversized Blouse",
    "Modern Long Sleeve",
    "Seoul Classic Blouse",
    "Tokyo Relaxed Blouse",
    "Elegant Daily Shirt",
    "Korean Premium Blouse",
    "Minimal Long Shirt",
    "Asian Fashion Blouse",
    "Relaxed Fit Blouse",
    "Premium Long Top",
    "Modern Oversized Shirt",
    "Seoul Daily Blouse",
    "Tokyo Soft Shirt",
    "Elegant Long Sleeve",
    "K-Style Long Blouse",
    "Classic Korean Shirt",
]


BEAUTY_NAMES = [
    "K-Beauty Glow Cream",
    "Seoul Hydrating Lotion",
    "Tokyo Face Cream",
    "Korean Skin Essence",
    "Asian Glow Serum",
    "Seoul Daily Moisturizer",
    "K-Beauty Powder",
    "Tokyo Soft Foundation",
    "Korean Lip Tint",
    "Seoul Velvet Lip",
    "Asian Beauty Lotion",
    "Korean Hand Cream",
    "Tokyo Perfume",
    "Seoul Floral Perfume",
    "K-Beauty Face Cream",
    "Japanese Skin Lotion",
    "Korean Brightening Cream",
    "Seoul Beauty Serum",
    "Tokyo Fragrance",
    "Asian Beauty Powder",
]


SHOES_NAMES = [
    "K-Style White Sneakers",
    "Seoul Classic Sneakers",
    "Tokyo Street Sneakers",
    "Japanese Casual Shoes",
    "Urban White Sneakers",
    "Black Premium Sneakers",
    "Seoul Running Shoes",
    "Tokyo Sport Shoes",
    "Minimal White Shoes",
    "Korean Street Shoes",
    "Classic Black Sneakers",
    "Modern Grey Sneakers",
    "Premium Casual Shoes",
    "Asian Street Sneakers",
    "Daily Comfort Shoes",
    "Tokyo Canvas Shoes",
    "Seoul Court Sneakers",
    "Modern Lifestyle Shoes",
    "Classic Low Sneakers",
    "Premium Sport Shoes",
]


# =========================================================
# DATABASE
# =========================================================

def connect_db():
    con = sqlite3.connect(DB_FILE)
    con.row_factory = sqlite3.Row
    return con


def get_columns(con, table):
    rows = con.execute(
        f"PRAGMA table_info({table})"
    ).fetchall()

    return [row["name"] for row in rows]


# =========================================================
# DATABASE INITIALIZATION
# =========================================================

def init_database():

    con = connect_db()

    # -----------------------------------------------------
    # PRODUCTS
    # -----------------------------------------------------

    con.execute("""
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            category TEXT NOT NULL,
            category_name TEXT NOT NULL,
            price REAL NOT NULL,
            image TEXT NOT NULL,
            sizes TEXT NOT NULL
        )
    """)

    product_columns = get_columns(
        con,
        "products"
    )

    if "category_name" not in product_columns:
        con.execute("""
            ALTER TABLE products
            ADD COLUMN category_name TEXT
        """)

    if "price" not in product_columns:
        con.execute("""
            ALTER TABLE products
            ADD COLUMN price REAL
        """)

    if "image" not in product_columns:
        con.execute("""
            ALTER TABLE products
            ADD COLUMN image TEXT
        """)

    if "sizes" not in product_columns:
        con.execute("""
            ALTER TABLE products
            ADD COLUMN sizes TEXT
        """)

    # -----------------------------------------------------
    # ORDERS
    # -----------------------------------------------------

    con.execute("""
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_code TEXT UNIQUE,
            product_id INTEGER,
            product_name TEXT,
            size TEXT,
            customer_name TEXT,
            phone TEXT,
            amount REAL,
            status TEXT DEFAULT 'PENDING'
        )
    """)

    order_columns = get_columns(
        con,
        "orders"
    )

    if "order_code" not in order_columns:
        con.execute("""
            ALTER TABLE orders
            ADD COLUMN order_code TEXT
        """)

    if "product_id" not in order_columns:
        con.execute("""
            ALTER TABLE orders
            ADD COLUMN product_id INTEGER
        """)

    if "product_name" not in order_columns:
        con.execute("""
            ALTER TABLE orders
            ADD COLUMN product_name TEXT
        """)

    if "size" not in order_columns:
        con.execute("""
            ALTER TABLE orders
            ADD COLUMN size TEXT
        """)

    if "customer_name" not in order_columns:
        con.execute("""
            ALTER TABLE orders
            ADD COLUMN customer_name TEXT
        """)

    if "phone" not in order_columns:
        con.execute("""
            ALTER TABLE orders
            ADD COLUMN phone TEXT
        """)

    if "amount" not in order_columns:

        con.execute("""
            ALTER TABLE orders
            ADD COLUMN amount REAL
        """)

        # Old database may have price column.
        if "price" in order_columns:
            con.execute("""
                UPDATE orders
                SET amount = price
                WHERE amount IS NULL
            """)

    if "status" not in order_columns:
        con.execute("""
            ALTER TABLE orders
            ADD COLUMN status TEXT DEFAULT 'PENDING'
        """)

    # -----------------------------------------------------
    # CATALOG VERSION
    #
    # DO NOT USE old app_config table.
    # SQLite user_version is used instead.
    # -----------------------------------------------------

    current_version = con.execute(
        "PRAGMA user_version"
    ).fetchone()[0]

    # -----------------------------------------------------
    # Check catalog
    # -----------------------------------------------------

    product_count = con.execute(
        "SELECT COUNT(*) FROM products"
    ).fetchone()[0]

    needs_rebuild = (
        current_version != CATALOG_VERSION
        or product_count != 240
    )

    # Old bad images
    bad_image_count = con.execute("""
        SELECT COUNT(*)
        FROM products
        WHERE image IS NULL
           OR image = ''
           OR image LIKE '%loremflickr%'
    """).fetchone()[0]

    if bad_image_count > 0:
        needs_rebuild = True

    # Check category counts
    for category, _, wanted in CATEGORIES:

        count = con.execute("""
            SELECT COUNT(*)
            FROM products
            WHERE category=?
        """, (category,)).fetchone()[0]

        if count != wanted:
            needs_rebuild = True
            break

    if needs_rebuild:
        rebuild_catalog(con)

    con.execute(
        f"PRAGMA user_version = {CATALOG_VERSION}"
    )

    con.commit()
    con.close()


# =========================================================
# IMAGE SELECTOR
# =========================================================

def get_image_pool(category):

    if category == "men-short":
        return MEN_SHORT_IMAGES

    if category == "men-long":
        return MEN_LONG_IMAGES

    if category == "women-short":
        return WOMEN_SHORT_IMAGES

    if category == "women-long":
        return WOMEN_LONG_IMAGES

    if category == "beauty":
        return BEAUTY_IMAGES

    return SHOES_IMAGES


def get_product_image(category, index):

    pool = get_image_pool(category)

    photo_id = pool[index % len(pool)]

    return pexels(photo_id)


# =========================================================
# PRODUCT NAME
# =========================================================

def get_name_pool(category):

    if category == "men-short":
        return MEN_SHORT_NAMES

    if category == "men-long":
        return MEN_LONG_NAMES

    if category == "women-short":
        return WOMEN_SHORT_NAMES

    if category == "women-long":
        return WOMEN_LONG_NAMES

    if category == "beauty":
        return BEAUTY_NAMES

    return SHOES_NAMES


def make_product_name(category, index):

    pool = get_name_pool(category)

    base = pool[index % len(pool)]

    if index < len(pool):
        return base

    return f"{base} {index + 1:02d}"


# =========================================================
# REBUILD 240 PRODUCTS
# =========================================================

def rebuild_catalog(con):

    print("")
    print("========================================")
    print(" REBUILDING KH FASHION CATALOG")
    print(" ASIAN MODEL COLLECTION")
    print("========================================")

    con.execute(
        "DELETE FROM products"
    )

    product_id = 1

    for category, category_name, total in CATEGORIES:

        for i in range(total):

            name = make_product_name(
                category,
                i
            )

            image = get_product_image(
                category,
                i
            )

            if category in [
                "men-short",
                "men-long",
                "women-short",
                "women-long"
            ]:
                price = round(
                    random.uniform(18, 59),
                    2
                )

                sizes = "S,M,L,XL"

            elif category == "beauty":

                price = round(
                    random.uniform(12, 69),
                    2
                )

                sizes = "ONE SIZE"

            else:

                price = round(
                    random.uniform(29, 89),
                    2
                )

                sizes = (
                    "36,37,38,39,40,"
                    "41,42,43,44"
                )

            con.execute("""
                INSERT INTO products
                (
                    id,
                    name,
                    category,
                    category_name,
                    price,
                    image,
                    sizes
                )
                VALUES (?,?,?,?,?,?,?)
            """, (
                product_id,
                name,
                category,
                category_name,
                price,
                image,
                sizes
            ))

            product_id += 1

    con.commit()

    print("")
    print("240 PRODUCTS CREATED")
    print("40 Men Short Sleeve")
    print("40 Men Long / Oversized")
    print("40 Women Short Sleeve")
    print("40 Women Long / Oversized")
    print("40 Women Beauty")
    print("40 Shoes")
    print("")
    print("========================================")


# =========================================================
# STARTUP
# =========================================================

@app.on_event("startup")
def startup_event():

    print("")
    print("========================================")
    print("       KH FASHION DATABASE")
    print("========================================")

    init_database()

    print("Database ready.")
    print("========================================")
    print("")


# =========================================================
# HEALTH
# =========================================================

@app.get("/api/health")
def health():

    con = connect_db()

    count = con.execute(
        "SELECT COUNT(*) FROM products"
    ).fetchone()[0]

    con.close()

    return {
        "success": True,
        "status": "OK",
        "products": count,
        "catalog_version": CATALOG_VERSION
    }


# =========================================================
# PRODUCTS
# =========================================================

@app.get("/api/products")
def products():

    con = connect_db()

    rows = con.execute("""
        SELECT
            id,
            name,
            category,
            category_name,
            price,
            image,
            sizes
        FROM products
        ORDER BY id ASC
    """).fetchall()

    con.close()

    result = []

    for row in rows:

        item = dict(row)

        item["price"] = float(
            item["price"] or 0
        )

        item["sizes"] = [
            x.strip()
            for x in (item["sizes"] or "").split(",")
            if x.strip()
        ]

        result.append(item)

    return result


# =========================================================
# ORDER REQUEST
# =========================================================

class OrderRequest(BaseModel):

    product_id: int = Field(
        ...,
        gt=0
    )

    product_name: str = ""

    size: str

    customer_name: str

    phone: str

    amount: float | None = None


# =========================================================
# CREATE ORDER
# =========================================================

@app.post("/api/orders")
def create_order(order: OrderRequest):

    con = connect_db()

    try:

        product = con.execute("""
            SELECT *
            FROM products
            WHERE id=?
        """, (
            order.product_id,
        )).fetchone()

        if not product:

            raise HTTPException(
                status_code=404,
                detail="Product not found"
            )

        valid_sizes = [
            x.strip()
            for x in product["sizes"].split(",")
        ]

        if order.size not in valid_sizes:

            raise HTTPException(
                status_code=400,
                detail=(
                    "Invalid size. Available sizes: "
                    + ", ".join(valid_sizes)
                )
            )

        customer_name = (
            order.customer_name or ""
        ).strip()

        phone = (
            order.phone or ""
        ).strip()

        if not customer_name:

            raise HTTPException(
                status_code=400,
                detail="Customer name is required"
            )

        if not phone:

            raise HTTPException(
                status_code=400,
                detail="Phone number is required"
            )

        # -------------------------------------------------
        # Generate unique order code
        # -------------------------------------------------

        order_code = None

        for _ in range(50):

            candidate = (
                "KH-"
                + "".join(
                    random.choices(
                        string.ascii_uppercase
                        + string.digits,
                        k=8
                    )
                )
            )

            found = con.execute("""
                SELECT id
                FROM orders
                WHERE order_code=?
            """, (
                candidate,
            )).fetchone()

            if not found:

                order_code = candidate
                break

        if not order_code:

            raise HTTPException(
                status_code=500,
                detail="Cannot generate order number"
            )

        real_price = float(
            product["price"]
        )

        con.execute("""
            INSERT INTO orders
            (
                order_code,
                product_id,
                product_name,
                size,
                customer_name,
                phone,
                amount,
                status
            )
            VALUES (?,?,?,?,?,?,?,?)
        """, (
            order_code,
            product["id"],
            product["name"],
            order.size,
            customer_name,
            phone,
            real_price,
            "PENDING"
        ))

        con.commit()

        return {
            "success": True,
            "order_code": order_code,
            "product_id": product["id"],
            "product_name": product["name"],
            "size": order.size,
            "customer_name": customer_name,
            "phone": phone,
            "amount": real_price,
            "status": "PENDING"
        }

    except HTTPException:
        con.rollback()
        raise

    except Exception as e:

        con.rollback()

        print(
            "CREATE ORDER ERROR:",
            repr(e)
        )

        raise HTTPException(
            status_code=500,
            detail=f"Database error: {str(e)}"
        )

    finally:

        con.close()


# =========================================================
# MARK PAID
# =========================================================

@app.post("/api/orders/{order_code}/paid")
def mark_paid(order_code: str):

    con = connect_db()

    try:

        order = con.execute("""
            SELECT *
            FROM orders
            WHERE order_code=?
        """, (
            order_code,
        )).fetchone()

        if not order:

            raise HTTPException(
                status_code=404,
                detail="Order not found"
            )

        con.execute("""
            UPDATE orders
            SET status='PAID'
            WHERE order_code=?
        """, (
            order_code,
        ))

        con.commit()

        return {
            "success": True,
            "order_code": order_code,
            "status": "PAID"
        }

    except HTTPException:
        con.rollback()
        raise

    except Exception as e:

        con.rollback()

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

    finally:

        con.close()


# =========================================================
# GET ORDERS
# =========================================================

@app.get("/api/orders")
def get_orders():

    con = connect_db()

    rows = con.execute("""
        SELECT *
        FROM orders
        ORDER BY id DESC
    """).fetchall()

    con.close()

    return [
        dict(row)
        for row in rows
    ]