'use client'

import { memo, useState, useRef } from 'react'
import { Handle, Position, NodeProps } from 'reactflow'

interface CustomNodeData {
  label: string
  image?: string
  color?: string
  onImageUpload?: (nodeId: string, imageUrl: string) => void
  onColorChange?: (nodeId: string, color: string) => void
  onDelete?: (nodeId: string) => void
}

function CustomNode({ id, data }: NodeProps<CustomNodeData>) {
  const [showMenu, setShowMenu] = useState(false)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const nodeColor = data.color || '#ffffff'

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const imageUrl = reader.result as string
        data.onImageUpload?.(id, imageUrl)
      }
      reader.readAsDataURL(file)
    }
    setShowMenu(false)
  }

  const handleColorChange = (color: string) => {
    data.onColorChange?.(id, color)
    setShowColorPicker(false)
    setShowMenu(false)
  }

  const handleDelete = () => {
    data.onDelete?.(id)
    setShowMenu(false)
  }

  const colors = [
    '#ffffff', '#f3f4f6', '#dbeafe', '#fef3c7', '#fecaca', 
    '#d1fae5', '#e9d5ff', '#fed7aa', '#fce7f3', '#e0e7ff'
  ]

  return (
    <div
      className="relative"
      onMouseEnter={() => setShowMenu(true)}
      onMouseLeave={() => {
        setShowMenu(false)
        setShowColorPicker(false)
      }}
    >
      <Handle type="target" position={Position.Top} />
      
      <div
        className="min-w-[180px] rounded border-2 border-black px-4 py-3 shadow-sm transition-shadow hover:shadow-md"
        style={{ backgroundColor: nodeColor }}
      >
        {/* Node Image */}
        {data.image && (
          <div className="mb-2">
            <img
              src={data.image}
              alt="Node"
              className="h-16 w-full rounded object-cover"
            />
          </div>
        )}

        {/* Node Label */}
        <div className="text-center text-sm font-medium text-black">
          {data.label}
        </div>
      </div>

      {/* Hover Menu */}
      {showMenu && (
        <div className="absolute -right-2 top-0 z-50 flex -translate-y-full flex-col gap-1 rounded border border-gray-300 bg-white p-1 shadow-lg">
          {/* Add Photo Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 rounded px-3 py-1.5 text-xs hover:bg-gray-100"
            title="Add Photo"
          >
            <span>📷</span>
            <span>Photo</span>
          </button>

          {/* Color Picker Button */}
          <button
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="flex items-center gap-2 rounded px-3 py-1.5 text-xs hover:bg-gray-100"
            title="Change Color"
          >
            <span>🎨</span>
            <span>Color</span>
          </button>

          {/* Delete Button */}
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 rounded px-3 py-1.5 text-xs text-red-600 hover:bg-red-50"
            title="Delete Node"
          >
            <span>🗑️</span>
            <span>Delete</span>
          </button>

          {/* Color Picker */}
          {showColorPicker && (
            <div className="absolute left-0 top-full mt-1 grid w-48 grid-cols-5 gap-1 rounded border border-gray-300 bg-white p-2 shadow-lg">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorChange(color)}
                  className="h-8 w-8 rounded border-2 border-gray-300 transition-transform hover:scale-110"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      <Handle type="source" position={Position.Bottom} />
    </div>
  )
}

export default memo(CustomNode)
