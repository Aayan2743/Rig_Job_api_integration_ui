import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { useState,useEffect  } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import api from '../../utils/api.js';






export function Payment() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [processing, setProcessing] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [error, setError] = useState("");

  const [conversion, setConversion] = useState(null); // 🔥 ADD THIS



  const feeAmount = 5;



  useEffect(() => {
  const fetchConversion = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.post(
        "/candidate/razorpay/order",
        { amount: feeAmount },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = res.data;

      if (data.success) {
        setConversion(data.conversion); // 🔥 SET HERE
      }
    } catch (err) {
      console.error("Conversion load failed", err);
    }
  };

  fetchConversion();
}, []);

  // const amountInINR = feeAmount * USD_TO_INR;

  // const pay = () => {
  //   setError("");
  //   setSuccessMsg("");

  //   if (!user || user.role !== "candidate") {
  //     setError("Please login as a candidate to make a payment.");
  //     return;
  //   }

  //   setProcessing(true);
  //   try {
  //     const payments = getPayments();

  //     const paymentRecord = {
  //       id: `pay_${Date.now()}`,
  //       amount: feeAmount,
  //       currency: "USD",
  //       feeLabel: "Application Fee",
  //       paymentFor: "job_application",
  //       payerEmail: user.email,
  //       payerName: user.name,
  //       payerRole: user.role,
  //       status: "paid",
  //       createdAt: new Date().toISOString(),
  //     };

  //     savePayments([paymentRecord, ...payments]);
  //     setSuccessMsg("Payment successful. Redirecting...");

  //     setTimeout(() => navigate("/jobs"), 1200);
  //   } catch (e) {
  //     setError(e?.message || "Payment failed. Please try again.");
  //   } finally {
  //     setProcessing(false);
  //   }
  // };


const pay = async () => {
  setError("");
  setSuccessMsg("");

  if (!user || user.role !== "candidate") {
    setError("Please login as a candidate to make a payment.");
    return;
  }

  try {
    setProcessing(true);

    const token = localStorage.getItem("token");




    // ✅ FIXED axios call
const res = await api.post(
  "/candidate/razorpay/order",
  { amount: feeAmount },
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

const data = res.data;
setConversion(data.conversion);

// ✅ NOW it's correct

  

    if (!data.success) {
      throw new Error("Order creation failed");
    }

    const options = {
      key: "rzp_test_RywTw9KUnaPKxd", // replace
      amount: data.order.amount,
      currency: "INR",
      name: "Job Portal",
      description: "Application Fee",
      order_id: data.order.id,

      handler: async function (response) {
        try {
          // const verifyRes = await api.post("/candidate/razorpay/verify", response);


       const verifyRes =      await api.post(
  "/candidate/razorpay/verify",
  response,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

          if (verifyRes.data.success) {
            setSuccessMsg("Payment successful 🎉");
            setTimeout(() => navigate("/jobs"), 1200);
          } else {
            setError("Payment verification failed");
          }
        } catch {
          setError("Verification error");
        }
      },

      prefill: {
        name: user.name,
        email: user.email,
      },

      theme: {
        color: "#6366f1",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

  } catch (e) {
    console.error(e); // 🔥 debug
    setError(e?.response?.data?.message || e.message || "Payment failed");
  } finally {
    setProcessing(false);
  }
};
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-border/60 shadow-sm overflow-hidden"
        >
          <div className="h-1.5 w-full" style={{ background: 'var(--gradient-primary)' }} />

          <div className="p-6 sm:p-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Payment </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              This is a placeholder payment page. Integrate your payment provider (Stripe/Razorpay) here.
            </p>

            <div className="mt-6 rounded-xl border border-border/70 bg-muted/30 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Amount Due</p>
                 
                 <p className="mt-1 text-xl font-bold text-foreground">
  ${feeAmount}
</p>

{conversion ? (
  <p className="text-sm text-gray-500">
    ≈ ₹{conversion.inr.toFixed(2)}
  </p>
) : (
  <p className="text-sm text-gray-400">Calculating...</p>
)}


            </div>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full">
                  Application Fee
                </span>
              </div>
            </div>

            {error && (
              <div className="mt-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 font-semibold">
                {error}
              </div>
            )}

            {successMsg && (
              <div className="mt-4 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-800 font-semibold">
                {successMsg}
              </div>
            )}

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={pay}
                disabled={processing}
                className="inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md hover:scale-[1.01] active:scale-[0.99]"
                style={{ background: 'var(--gradient-primary)' }}
              >
                {processing ? "Processing..." : `Pay $${feeAmount}`}
              </button>

              <Link
                to="/jobs"
                className="inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold border border-border/80 bg-white text-foreground transition hover:bg-muted/40"
              >
                Back to Jobs
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
