"use client"

import { useState } from "react"
import { useDispatch } from "react-redux"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { showSnackbar } from "@/store/slices/uiSlice"
import { CreditCard, Plus, Trash2, Shield } from "lucide-react"

const mockPaymentMethods = [
  {
    id: "1",
    type: "visa",
    last4: "4242",
    expiryMonth: 12,
    expiryYear: 2025,
    isDefault: true,
  },
  {
    id: "2",
    type: "mastercard",
    last4: "8888",
    expiryMonth: 8,
    expiryYear: 2026,
    isDefault: false,
  },
]

export default function PaymentMethods() {
  const dispatch = useDispatch()
  const [paymentMethods, setPaymentMethods] = useState(mockPaymentMethods)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newCard, setNewCard] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
  })

  const handleAddCard = () => {
    const newMethod = {
      id: Date.now().toString(),
      type: "visa",
      last4: newCard.number.slice(-4),
      expiryMonth: Number.parseInt(newCard.expiry.split("/")[0]),
      expiryYear: Number.parseInt("20" + newCard.expiry.split("/")[1]),
      isDefault: paymentMethods.length === 0,
    }

    setPaymentMethods([...paymentMethods, newMethod])
    setNewCard({ number: "", expiry: "", cvc: "", name: "" })
    setShowAddForm(false)
    dispatch(showSnackbar({ message: "Payment method added successfully!", type: "success" }))
  }

  const handleRemoveCard = (id: string) => {
    setPaymentMethods(paymentMethods.filter((method) => method.id !== id))
    dispatch(showSnackbar({ message: "Payment method removed", type: "info" }))
  }

  const handleSetDefault = (id: string) => {
    setPaymentMethods(
      paymentMethods.map((method) => ({
        ...method,
        isDefault: method.id === id,
      })),
    )
    dispatch(showSnackbar({ message: "Default payment method updated", type: "success" }))
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Payment Methods
          </CardTitle>
          <CardDescription className="text-gray-400">Manage your payment methods for subscriptions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border border-gray-700"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-400 rounded flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium">•••• •••• •••• {method.last4}</p>
                  <p className="text-gray-400 text-sm">
                    Expires {method.expiryMonth.toString().padStart(2, "0")}/{method.expiryYear}
                    {method.isDefault && (
                      <span className="ml-2 bg-blue-600 text-white px-2 py-1 rounded text-xs">Default</span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!method.isDefault && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-600 text-white hover:bg-gray-700 bg-transparent"
                    onClick={() => handleSetDefault(method.id)}
                  >
                    Set Default
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
                  onClick={() => handleRemoveCard(method.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}

          {showAddForm ? (
            <div className="p-4 bg-gray-800 rounded-lg border border-gray-700 space-y-4">
              <h3 className="text-white font-medium">Add New Payment Method</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="cardName" className="text-white">
                    Cardholder Name
                  </Label>
                  <Input
                    id="cardName"
                    placeholder="John Doe"
                    value={newCard.name}
                    onChange={(e) => setNewCard({ ...newCard, name: e.target.value })}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="cardNumber" className="text-white">
                    Card Number
                  </Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={newCard.number}
                    onChange={(e) => setNewCard({ ...newCard, number: e.target.value })}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="expiry" className="text-white">
                    Expiry Date
                  </Label>
                  <Input
                    id="expiry"
                    placeholder="MM/YY"
                    value={newCard.expiry}
                    onChange={(e) => setNewCard({ ...newCard, expiry: e.target.value })}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="cvc" className="text-white">
                    CVC
                  </Label>
                  <Input
                    id="cvc"
                    placeholder="123"
                    value={newCard.cvc}
                    onChange={(e) => setNewCard({ ...newCard, cvc: e.target.value })}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Shield className="w-4 h-4" />
                Your payment information is encrypted and secure
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddCard} className="bg-blue-600 hover:bg-blue-700 text-white">
                  Add Card
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowAddForm(false)}
                  className="border-gray-600 text-white hover:bg-gray-700"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button
              onClick={() => setShowAddForm(true)}
              className="w-full bg-gray-800 border border-gray-700 text-white hover:bg-gray-700 border-dashed"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Payment Method
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
