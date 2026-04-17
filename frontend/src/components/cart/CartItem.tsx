import Image from "next/image"
import { CartItem as CartItemType } from "@/lib/types"


interface CartItemProps {
  item: CartItemType
  onRemove: () => void
  onUpdateQuantity: (quantity: number) => void
}

export function CartItem({ item, onRemove, onUpdateQuantity }: CartItemProps) {
  const subtotal = item.product.price * item.quantity;

  return (
    <div className="flex items-start justify-between border-b border-chanel-gray-light py-6">
      {/* Image + Nom */}
      <div className="flex items-center gap-4">
        <div className="relative h-20 w-20 overflow-hidden bg-chanel-gray-light">
          {item.product.image_url && (
            <Image
              src={item.product.image_url}
              alt={item.product.name}
              fill
              className="object-cover"
            />
          )}
        </div>
        <div>
          <p className="font-serif text-sm text-chanel-black">{item.product.name}</p>
          <p className="font-medium text-sm text-chanel-black">
            {item.product.price.toFixed(2)} €
          </p>
        </div>
      </div>

      {/* Quantité + Sous-total + Supprimer */}
      <div className="flex items-center gap-6">
        {/* Quantité */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => item.quantity > 1 && onUpdateQuantity(item.quantity - 1)}
            className="border border-chanel-gray-light px-2 py-1 text-xs hover:bg-chanel-gray-light"
          >
            -
          </button>
          <span className="w-6 text-center text-sm">{item.quantity}</span>
          <button
            onClick={() => onUpdateQuantity(item.quantity + 1)}
            className="border border-chanel-gray-light px-2 py-1 text-xs hover:bg-chanel-gray-light"
          >
            +
          </button>
        </div>

        {/* Sous-total */}
        <span className="font-medium text-sm text-chanel-black">
          {subtotal.toFixed(2)} €
        </span>

        {/* Supprimer */}
        <button
          onClick={onRemove}
          className="text-xs text-chanel-gray hover:underline"
        >
          Supprimer
        </button>
      </div>
    </div>
  );
}