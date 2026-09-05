import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Routes,
  Route,
  Link,
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";

import { QRCodeCanvas } from "qrcode.react";

import {
  getProducts,
  createOrder,
  markPaid,
} from "./api";


// =========================================================
// CATEGORIES
// =========================================================

const categories = [
  ["all", "🛍️ All Products"],
  ["men-short", "👕 Men Short Sleeve"],
  ["men-long", "🧥 Men Long / Oversized"],
  ["women-short", "👚 Women Short Sleeve"],
  ["women-long", "👗 Women Long / Oversized"],
  ["beauty", "💄 Women Beauty"],
  ["shoes", "👟 Shoes"],
];


// =========================================================
// IMAGE FALLBACK
// =========================================================

function ProductImage({
  src,
  alt,
  className = "",
}) {
  const [image, setImage] = useState(src);

  useEffect(() => {
    setImage(src);
  }, [src]);

  return (
    <img
      src={image}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => {
        if (image !== "/fashion-fallback.svg") {
          setImage("/fashion-fallback.svg");
        }
      }}
    />
  );
}


// =========================================================
// HEADER
// =========================================================

function Header({
  search,
  setSearch,
}) {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">

      <div className="max-w-7xl mx-auto px-4">

        <div className="h-[72px] flex items-center justify-between gap-5">

          <Link
            to="/"
            className="text-2xl font-black tracking-tight whitespace-nowrap"
          >
            KH
            <span className="text-pink-600">
              FASHION
            </span>
          </Link>


          <div className="hidden md:block flex-1 max-w-xl">

            <div className="relative">

              <input
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search products..."
                className="
                  w-full
                  h-11
                  border
                  border-slate-200
                  rounded-xl
                  px-4
                  outline-none
                  focus:border-pink-400
                  focus:ring-4
                  focus:ring-pink-100
                  transition
                "
              />

              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                🔎
              </span>

            </div>

          </div>


          <Link
            to="/"
            className="font-bold text-slate-800 hover:text-pink-600"
          >
            Home
          </Link>

        </div>


        <div className="md:hidden pb-3">

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search products..."
            className="
              w-full
              h-11
              border
              border-slate-200
              rounded-xl
              px-4
              outline-none
            "
          />

        </div>

      </div>

    </header>
  );
}


// =========================================================
// CATEGORY BAR
// =========================================================

function CategoryBar({
  selected,
  onChange,
  products,
}) {

  function countCategory(id) {

    if (id === "all") {
      return products.length;
    }

    return products.filter(
      (p) => p.category === id
    ).length;
  }

  return (
    <div className="
      bg-white
      border-b
      border-slate-200
      sticky
      top-[72px]
      z-40
    ">

      <div className="
        max-w-7xl
        mx-auto
        px-4
        py-4
      ">

        <div className="
          flex
          gap-3
          overflow-x-auto
          pb-1
          scrollbar-thin
        ">

          {categories.map(
            ([id, label]) => {

              const active =
                selected === id;

              return (
                <button
                  key={id}
                  onClick={() =>
                    onChange(id)
                  }
                  className={`
                    shrink-0
                    flex
                    items-center
                    gap-2
                    px-5
                    py-2.5
                    rounded-full
                    border
                    font-semibold
                    text-sm
                    transition
                    whitespace-nowrap
                    ${
                      active
                        ? "bg-slate-950 text-white border-slate-950 shadow-md"
                        : "bg-white text-slate-700 border-slate-300 hover:border-pink-400 hover:text-pink-600"
                    }
                  `}
                >

                  <span>
                    {label}
                  </span>

                  <span
                    className={`
                      min-w-7
                      h-6
                      px-2
                      rounded-full
                      flex
                      items-center
                      justify-center
                      text-xs
                      ${
                        active
                          ? "bg-white/20 text-white"
                          : "bg-slate-100 text-slate-500"
                      }
                    `}
                  >
                    {countCategory(id)}
                  </span>

                </button>
              );
            }
          )}

        </div>

      </div>

    </div>
  );
}


// =========================================================
// PRODUCT CARD
// =========================================================

function ProductCard({
  p,
}) {

  return (
    <article
      className="
        group
        bg-white
        rounded-2xl
        overflow-hidden
        border
        border-slate-200
        shadow-sm
        hover:shadow-xl
        hover:-translate-y-1
        transition-all
        duration-300
      "
    >

      <Link to={`/product/${p.id}`}>

        <div className="
          relative
          overflow-hidden
          bg-slate-100
          aspect-[4/5]
        ">

          <ProductImage
            src={p.image}
            alt={p.name}
            className="
              w-full
              h-full
              object-cover
              group-hover:scale-105
              transition-transform
              duration-500
            "
          />


          <div className="
            absolute
            top-3
            left-3
            bg-white
            text-pink-600
            px-3
            py-1.5
            rounded-full
            text-xs
            font-bold
            shadow-sm
          ">
            {p.category_name
              .replace("👕 ", "")
              .replace("🧥 ", "")
              .replace("👚 ", "")
              .replace("👗 ", "")
              .replace("💄 ", "")
              .replace("👟 ", "")}
          </div>

        </div>

      </Link>


      <div className="p-4">

        <p className="text-xs text-slate-400 mb-1">
          KH Fashion
        </p>

        <h3 className="
          font-extrabold
          text-slate-900
          text-base
          line-clamp-2
          min-h-[48px]
        ">
          {p.name}
        </h3>


        <div className="
          mt-3
          flex
          items-center
          justify-between
          gap-2
        ">

          <span className="
            text-xl
            font-black
            text-slate-950
          ">
            ${Number(p.price).toFixed(2)}
          </span>


          <Link
            to={`/product/${p.id}`}
            className="
              text-pink-600
              font-bold
              text-sm
              hover:text-pink-800
            "
          >
            View →
          </Link>

        </div>

      </div>

    </article>
  );
}


// =========================================================
// HOME
// =========================================================

function Home({
  products,
}) {

  const [search, setSearch] =
    useState("");

  const [category, setCategory] =
    useState("all");


  const filteredProducts =
    useMemo(() => {

      const q =
        search
          .trim()
          .toLowerCase();

      return products.filter(
        (p) => {

          const categoryOK =
            category === "all" ||
            p.category === category;

          const searchOK =
            !q ||
            p.name
              .toLowerCase()
              .includes(q);

          return (
            categoryOK &&
            searchOK
          );
        }
      );

    }, [
      products,
      category,
      search,
    ]);


  return (
    <div className="min-h-screen bg-slate-50">

      <Header
        search={search}
        setSearch={setSearch}
      />


      <CategoryBar
        selected={category}
        onChange={setCategory}
        products={products}
      />


      <main className="
        max-w-7xl
        mx-auto
        px-4
        py-10
      ">

        <div className="mb-8">

          <p className="
            uppercase
            tracking-[0.28em]
            text-xs
            font-black
            text-pink-600
          ">
            KH FASHION STORE
          </p>


          <h1 className="
            text-4xl
            md:text-5xl
            font-black
            text-slate-950
            mt-2
          ">
            Products
          </h1>


          <p className="
            text-slate-500
            mt-2
          ">
            Showing{" "}
            <b className="text-slate-800">
              {filteredProducts.length}
            </b>{" "}
            products
          </p>

        </div>


        {filteredProducts.length === 0 ? (

          <div className="
            bg-white
            rounded-2xl
            border
            p-12
            text-center
          ">

            <div className="text-5xl">
              🔎
            </div>

            <h2 className="
              mt-4
              text-2xl
              font-black
            ">
              No products found
            </h2>

            <p className="
              mt-2
              text-slate-500
            ">
              Try another search.
            </p>

          </div>

        ) : (

          <div className="
            grid
            grid-cols-2
            md:grid-cols-3
            lg:grid-cols-5
            gap-4
            md:gap-5
          ">

            {filteredProducts.map(
              (p) => (
                <ProductCard
                  key={p.id}
                  p={p}
                />
              )
            )}

          </div>

        )}

      </main>

    </div>
  );
}


// =========================================================
// PRODUCT PAGE
// =========================================================

function ProductPage({
  products,
}) {

  const { id } =
    useParams();

  const navigate =
    useNavigate();

  const location =
    useLocation();


  const product =
    products.find(
      (x) =>
        x.id === Number(id)
    );


  const [size, setSize] =
    useState(
      product?.sizes?.[0] || "M"
    );


  useEffect(() => {

    if (product?.sizes?.length) {
      setSize(product.sizes[0]);
    }

  }, [product]);


  if (!product) {

    return (
      <div className="
        min-h-screen
        grid
        place-items-center
        p-8
      ">

        <div className="text-center">

          <h1 className="
            text-3xl
            font-black
          ">
            Product not found
          </h1>

          <Link
            to="/"
            className="
              inline-block
              mt-5
              bg-slate-950
              text-white
              px-6
              py-3
              rounded-xl
            "
          >
            Back Home
          </Link>

        </div>

      </div>
    );
  }


  return (
    <div className="
      min-h-screen
      bg-slate-50
    ">

      <Header
        search=""
        setSearch={() => {}}
      />


      <main className="
        max-w-6xl
        mx-auto
        px-4
        py-10
      ">

        <button
          onClick={() =>
            navigate(-1)
          }
          className="
            mb-6
            text-slate-500
            hover:text-pink-600
            font-semibold
          "
        >
          ← Back
        </button>


        <div className="
          bg-white
          rounded-3xl
          border
          overflow-hidden
          grid
          md:grid-cols-2
          shadow-sm
        ">

          <div className="
            bg-slate-100
            min-h-[450px]
          ">

            <ProductImage
              src={product.image}
              alt={product.name}
              className="
                w-full
                h-full
                min-h-[450px]
                object-cover
              "
            />

          </div>


          <div className="
            p-7
            md:p-10
            flex
            flex-col
            justify-center
          ">

            <p className="
              text-sm
              text-pink-600
              font-bold
            ">
              {product.category_name}
            </p>


            <h1 className="
              text-3xl
              md:text-4xl
              font-black
              mt-2
            ">
              {product.name}
            </h1>


            <p className="
              text-3xl
              font-black
              text-pink-600
              mt-5
            ">
              ${Number(product.price).toFixed(2)}
            </p>


            <p className="
              text-slate-500
              mt-5
              leading-7
            ">
              Premium fashion collection
              inspired by modern Korean,
              Japanese and Asian street
              fashion.
            </p>


            <div className="mt-7">

              <label className="
                block
                font-bold
                mb-3
              ">
                Select Size
              </label>


              <div className="
                flex
                flex-wrap
                gap-2
              ">

                {product.sizes.map(
                  (s) => (

                    <button
                      key={s}
                      onClick={() =>
                        setSize(s)
                      }
                      className={`
                        min-w-14
                        px-4
                        py-2.5
                        rounded-xl
                        border
                        font-bold
                        transition
                        ${
                          size === s
                            ? "bg-slate-950 text-white border-slate-950"
                            : "bg-white hover:border-pink-400"
                        }
                      `}
                    >
                      {s}
                    </button>

                  )
                )}

              </div>

            </div>


            <button
              onClick={() =>
                navigate(
                  `/checkout/${product.id}`,
                  {
                    state: {
                      size,
                    },
                  }
                )
              }
              className="
                mt-8
                bg-pink-600
                hover:bg-pink-700
                text-white
                py-4
                rounded-xl
                font-black
                text-lg
                transition
              "
            >
              Buy Now
            </button>

          </div>

        </div>

      </main>

    </div>
  );
}


// =========================================================
// CHECKOUT
// =========================================================

function Checkout({
  products,
}) {

  const { id } =
    useParams();

  const navigate =
    useNavigate();

  const location =
    useLocation();


  const product =
    products.find(
      (x) =>
        x.id === Number(id)
    );


  const [size, setSize] =
    useState(
      location.state?.size ||
      product?.sizes?.[0] ||
      "M"
    );


  const [name, setName] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [order, setOrder] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [paid, setPaid] =
    useState(false);

  const [error, setError] =
    useState("");


  useEffect(() => {

    if (
      product &&
      !product.sizes.includes(size)
    ) {
      setSize(product.sizes[0]);
    }

  }, [product, size]);


  if (!product) {

    return (
      <div className="p-10 text-center">

        <h1 className="
          text-2xl
          font-black
        ">
          Product not found
        </h1>

      </div>
    );
  }


  async function submit(e) {

    e.preventDefault();

    setError("");

    if (!name.trim()) {
      setError(
        "Please enter customer name."
      );
      return;
    }

    if (!phone.trim()) {
      setError(
        "Please enter phone number."
      );
      return;
    }


    setLoading(true);


    try {

      const data =
        await createOrder({

          product_id:
            product.id,

          product_name:
            product.name,

          size,

          customer_name:
            name,

          phone,

          amount:
            Number(product.price),

        });


      setOrder(data);

    } catch (err) {

      setError(
        err.message ||
        "Cannot create order"
      );

    } finally {

      setLoading(false);

    }
  }


  async function pay() {

    if (!order) return;

    try {

      await markPaid(
        order.order_code
      );

      setPaid(true);

    } catch (err) {

      setError(
        err.message ||
        "Payment update failed"
      );

    }
  }


  return (
    <div className="
      min-h-screen
      bg-slate-50
    ">

      <Header
        search=""
        setSearch={() => {}}
      />


      <main className="
        max-w-4xl
        mx-auto
        px-4
        py-10
      ">

        <h1 className="
          text-3xl
          font-black
          mb-7
        ">
          Checkout
        </h1>


        {!order && (

          <form
            onSubmit={submit}
            className="
              bg-white
              border
              rounded-3xl
              p-6
              md:p-8
              shadow-sm
            "
          >

            <div className="
              flex
              gap-4
              items-center
              mb-7
              p-3
              bg-slate-50
              rounded-2xl
            ">

              <ProductImage
                src={product.image}
                alt={product.name}
                className="
                  w-28
                  h-28
                  object-cover
                  rounded-2xl
                "
              />


              <div>

                <p className="
                  text-xs
                  text-slate-400
                ">
                  KH Fashion
                </p>

                <h2 className="
                  font-black
                  text-lg
                ">
                  {product.name}
                </h2>

                <p className="
                  text-pink-600
                  font-black
                  text-xl
                  mt-1
                ">
                  ${Number(product.price).toFixed(2)}
                </p>

              </div>

            </div>


            {error && (

              <div className="
                mb-5
                bg-red-50
                border
                border-red-200
                text-red-700
                rounded-xl
                p-4
                font-semibold
              ">
                {error}
              </div>

            )}


            <div className="grid gap-5">

              <div>

                <label className="
                  block
                  font-bold
                  mb-2
                ">
                  Size
                </label>

                <select
                  value={size}
                  onChange={(e) =>
                    setSize(e.target.value)
                  }
                  className="
                    w-full
                    border
                    rounded-xl
                    p-3
                    outline-none
                  "
                >

                  {product.sizes.map(
                    (s) => (
                      <option
                        key={s}
                        value={s}
                      >
                        {s}
                      </option>
                    )
                  )}

                </select>

              </div>


              <div>

                <label className="
                  block
                  font-bold
                  mb-2
                ">
                  Customer Name
                </label>

                <input
                  required
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  placeholder="Enter customer name"
                  className="
                    w-full
                    border
                    rounded-xl
                    p-3
                    outline-none
                    focus:border-pink-400
                  "
                />

              </div>


              <div>

                <label className="
                  block
                  font-bold
                  mb-2
                ">
                  Phone Number
                </label>

                <input
                  required
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value)
                  }
                  placeholder="Enter phone number"
                  className="
                    w-full
                    border
                    rounded-xl
                    p-3
                    outline-none
                    focus:border-pink-400
                  "
                />

              </div>


              <button
                type="submit"
                disabled={loading}
                className="
                  bg-slate-950
                  hover:bg-pink-600
                  disabled:opacity-50
                  text-white
                  rounded-xl
                  py-4
                  font-black
                  text-lg
                  transition
                "
              >
                {loading
                  ? "Creating Order..."
                  : "Create Order"}
              </button>

            </div>

          </form>

        )}


        {order && !paid && (

          <div className="
            bg-white
            border
            rounded-3xl
            p-7
            text-center
            shadow-sm
          ">

            <div className="
              inline-flex
              px-4
              py-2
              rounded-full
              bg-pink-50
              text-pink-600
              font-bold
              text-sm
            ">
              Order Created
            </div>


            <h2 className="
              text-3xl
              font-black
              mt-4
            ">
              Scan QR to Pay
            </h2>


            <p className="
              text-slate-500
              mt-2
            ">
              Order:{" "}
              <b className="text-slate-900">
                {order.order_code}
              </b>
            </p>


            <div className="
              my-7
              flex
              justify-center
            ">

              <div className="
                p-5
                bg-white
                rounded-2xl
                border
                shadow-lg
              ">

                <QRCodeCanvas
                  value={
                    `KH-FASHION-PAY|` +
                    `${order.order_code}|` +
                    `${order.amount}`
                  }
                  size={250}
                  level="H"
                  includeMargin={true}
                />

              </div>

            </div>


            <p className="
              text-3xl
              font-black
              text-pink-600
            ">
              ${Number(order.amount).toFixed(2)}
            </p>


            {error && (

              <div className="
                mt-5
                bg-red-50
                text-red-700
                p-3
                rounded-xl
              ">
                {error}
              </div>

            )}


            <button
              onClick={pay}
              className="
                mt-6
                bg-green-600
                hover:bg-green-700
                text-white
                px-7
                py-3
                rounded-xl
                font-black
              "
            >
              ✓ Demo: Payment Complete
            </button>

          </div>

        )}


        {order && paid && (

          <div className="
            bg-white
            border
            rounded-3xl
            p-10
            text-center
            shadow-sm
          ">

            <div className="
              mx-auto
              w-20
              h-20
              rounded-full
              bg-green-100
              text-green-600
              grid
              place-items-center
              text-5xl
            ">
              ✓
            </div>


            <h2 className="
              text-3xl
              font-black
              mt-5
            ">
              Payment Successful
            </h2>


            <p className="
              text-slate-500
              mt-2
            ">
              Your order has been confirmed.
            </p>


            <div className="
              mt-5
              bg-slate-50
              rounded-2xl
              p-5
            ">

              <p className="text-sm text-slate-500">
                Order Number
              </p>

              <p className="
                font-black
                text-xl
              ">
                {order.order_code}
              </p>

            </div>


            <button
              onClick={() =>
                navigate("/")
              }
              className="
                mt-7
                bg-slate-950
                hover:bg-pink-600
                text-white
                px-7
                py-3
                rounded-xl
                font-bold
                transition
              "
            >
              ← Back to Home
            </button>

          </div>

        )}

      </main>

    </div>
  );
}


// =========================================================
// APP
// =========================================================

export default function App() {

  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  useEffect(() => {

    let alive = true;


    getProducts()

      .then((data) => {

        if (!alive) return;

        setProducts(data);
        setError("");

      })

      .catch((err) => {

        if (!alive) return;

        setError(
          err.message ||
          "Cannot connect to FastAPI"
        );

      })

      .finally(() => {

        if (!alive) return;

        setLoading(false);

      });


    return () => {
      alive = false;
    };

  }, []);


  if (loading) {

    return (
      <div className="
        min-h-screen
        grid
        place-items-center
        bg-slate-50
      ">

        <div className="text-center">

          <div className="
            w-12
            h-12
            border-4
            border-slate-200
            border-t-pink-600
            rounded-full
            animate-spin
            mx-auto
          " />

          <p className="
            mt-4
            font-bold
          ">
            Loading KH Fashion...
          </p>

        </div>

      </div>
    );
  }


  if (error) {

    return (
      <div className="
        min-h-screen
        grid
        place-items-center
        p-6
        bg-slate-50
      ">

        <div className="
          max-w-md
          w-full
          bg-white
          border
          rounded-3xl
          p-8
          text-center
          shadow-sm
        ">

          <div className="text-5xl">
            ⚠️
          </div>


          <h1 className="
            text-2xl
            font-black
            mt-4
          ">
            Backend Not Connected
          </h1>


          <p className="
            text-red-600
            mt-3
            font-semibold
          ">
            {error}
          </p>


          <p className="
            text-slate-500
            mt-4
            text-sm
          ">
            Make sure FastAPI is running
            on port 8000.
          </p>


          <button
            onClick={() =>
              window.location.reload()
            }
            className="
              mt-6
              bg-slate-950
              text-white
              px-6
              py-3
              rounded-xl
              font-bold
            "
          >
            Retry
          </button>

        </div>

      </div>
    );
  }


  return (
    <Routes>

      <Route
        path="/"
        element={
          <Home
            products={products}
          />
        }
      />

      <Route
        path="/product/:id"
        element={
          <ProductPage
            products={products}
          />
        }
      />

      <Route
        path="/checkout/:id"
        element={
          <Checkout
            products={products}
          />
        }
      />

    </Routes>
  );
}