import React, { useState } from 'react';
import { Plus, Trash2, GripVertical, X } from 'lucide-react';
import ImageUploader from './ImageUploader';

export interface ContentBlock {
  id: string;
  heading: string;
  text: string;
  image?: string;
}

interface ContentBlockEditorProps {
  blocks: ContentBlock[];
  onBlocksChange: (blocks: ContentBlock[]) => void;
}

const ContentBlockEditor: React.FC<ContentBlockEditorProps> = ({
  blocks,
  onBlocksChange
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingBlock, setEditingBlock] = useState<ContentBlock | null>(null);

  const handleAdd = () => {
    const newBlock: ContentBlock = {
      id: `block-${Date.now()}`,
      heading: '',
      text: '',
      image: undefined
    };
    onBlocksChange([...blocks, newBlock]);
    setEditingId(newBlock.id);
    setEditingBlock(newBlock);
  };

  const handleEdit = (block: ContentBlock) => {
    setEditingId(block.id);
    setEditingBlock({ ...block });
  };

  const handleSave = () => {
    if (editingBlock) {
      const updated = blocks.map(b => 
        b.id === editingBlock.id ? editingBlock : b
      );
      onBlocksChange(updated);
    }
    setEditingId(null);
    setEditingBlock(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditingBlock(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this content block?')) {
      onBlocksChange(blocks.filter(b => b.id !== id));
    }
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= blocks.length) return;

    const newBlocks = [...blocks];
    [newBlocks[index], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[index]];
    onBlocksChange(newBlocks);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-green-900">Content Blocks</h3>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Block
        </button>
      </div>

      <div className="space-y-4">
        {blocks.map((block, index) => (
          <div
            key={block.id}
            className="bg-white border-2 border-gray-200 rounded-lg p-4"
          >
            {editingId === block.id ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Heading
                  </label>
                  <input
                    type="text"
                    value={editingBlock?.heading || ''}
                    onChange={(e) => setEditingBlock({ ...editingBlock!, heading: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Text Content
                  </label>
                  <textarea
                    value={editingBlock?.text || ''}
                    onChange={(e) => setEditingBlock({ ...editingBlock!, text: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <ImageUploader
                    currentImage={editingBlock?.image}
                    onImageChange={(imagePath) => setEditingBlock({ ...editingBlock!, image: imagePath })}
                    directory="content"
                    label="Optional Image"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-4">
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => handleMove(index, 'up')}
                    disabled={index === 0}
                    className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => handleMove(index, 'down')}
                    disabled={index === blocks.length - 1}
                    className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                  >
                    ↓
                  </button>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-green-900 mb-2">{block.heading || 'Untitled Block'}</h4>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">{block.text || 'No content'}</p>
                  {block.image && (
                    <img src={block.image} alt="" className="w-32 h-32 object-cover rounded-lg" />
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(block)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(block.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {blocks.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No content blocks yet. Click "Add Block" to create one.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentBlockEditor;

