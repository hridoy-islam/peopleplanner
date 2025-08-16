
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { FileIcon, Pencil, Trash2, Eye } from 'lucide-react'
import { useForm } from 'react-hook-form'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
type DocumentCategory = 'General' | 'Legal' | 'Finance' | 'HR' | 'Technical'

interface Document {
  id: string
  title: string
  category: DocumentCategory
  file: File | null
  fileName: string
  uploadedAt: Date
}

const categories: DocumentCategory[] = ['General', 'Legal', 'Finance', 'HR', 'Technical']

export default function DocumentPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingDoc, setEditingDoc] = useState<Document | null>(null)
  const [viewingDoc, setViewingDoc] = useState<Document | null>(null)

  const { register, handleSubmit, reset, setValue, watch } = useForm<{
    title: string
    category: DocumentCategory
    file: FileList
  }>()

  const selectedFile = watch('file')?.[0]

  const onSubmit = (data: { title: string; category: DocumentCategory; file: FileList }) => {
    const file = data.file[0]
    const newDoc: Document = {
      id: editingDoc ? editingDoc.id : Date.now().toString(),
      title: data.title,
      category: data.category,
      file: file,
      fileName: file.name,
      uploadedAt: new Date(),
    }

    if (editingDoc) {
      setDocuments((prev) =>
        prev.map((doc) => (doc.id === editingDoc.id ? newDoc : doc))
      )
      setEditingDoc(null)
    } else {
      setDocuments((prev) => [newDoc, ...prev])
    }

    reset()
    setIsDialogOpen(false)
  }

  const handleEdit = (doc: Document) => {
    setEditingDoc(doc)
    setValue('title', doc.title)
    setValue('category', doc.category)
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id))
  }

  const handleView = (doc: Document) => {
    setViewingDoc(doc)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    reset()
    setEditingDoc(null)
  }

  return (
<div className="w-full bg-transparent shadow-none px-0">
  {/* Header: Title and Create Button */}
  <div className="flex flex-row items-center justify-between mb-6">
    <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Documents</h3>
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className='bg-supperagent text-white hover:bg-supperagent/90'>+ Create Document</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editingDoc ? 'Edit Document' : 'Add New Document'}</DialogTitle>
          <DialogDescription>
            Enter document details and upload a file.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="title">Document Title</Label>
            <Input
              id="title"
              placeholder="e.g. Employee Handbook"
              {...register('title', { required: true })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              onValueChange={(value) => setValue('category', value as DocumentCategory)}
              value={watch('category')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">Upload File</Label>
            <Input
              id="file"
              type="file"
              accept=".pdf,.doc,.docx,.txt,.xlsx"
              {...register('file', { required: !editingDoc })}
            />
            {selectedFile && (
              <p className="text-sm text-muted-foreground">
                Selected: {selectedFile.name}
              </p>
            )}
          </div>

          <DialogFooter className="sm:justify-end">
            <Button type="button" variant="secondary" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button type="submit" className='bg-supperagent text-white hover:bg-supperagent/90'>{editingDoc ? 'Update' : 'Create'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  </div>

  {/* Document Table (Replaces CardContent) */}
  <div className="mt-4">
    {documents.length === 0 ? (
      <p className="text-center text-muted-foreground py-6">No documents uploaded yet.</p>
    ) : (
      <div className="rounded-md  bg-white shadow-sm overflow-hidden">
        <div className="h-[400px] overflow-y-auto p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">Title</TableHead>
                <TableHead className="w-[30%]">Category</TableHead>
                <TableHead className="w-[30%]">File Name</TableHead>
                <TableHead className="w-[80px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc) => (
                <TableRow key={doc.id} className="hover:bg-gray-50 transition">
                  <TableCell className="font-medium">{doc.title}</TableCell>
                  <TableCell>{doc.category}</TableCell>
                  <TableCell className="text-muted-foreground">{doc.fileName}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="default"
                        size="icon"
                        onClick={() => handleView(doc)}
                        aria-label="View document"
                        className='bg-supperagent text-white hover:bg-supperagent/90'
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="default"
                        size="icon"
                        onClick={() => handleEdit(doc)}
                        aria-label="Edit document"
                        className='bg-supperagent text-white hover:bg-supperagent/90'

                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="default"
                        size="icon"
                        onClick={() => handleDelete(doc.id)}
                        aria-label="Delete document"
                        className='bg-destructive text-white hover:bg-destructive/90'

                      >
                        <Trash2 className="h-4 w-4 text-white" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    )}
  </div>

  {/* View Document Modal */}
  {viewingDoc && (
    <Dialog open={!!viewingDoc} onOpenChange={() => setViewingDoc(null)}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>View Document</DialogTitle>
        </DialogHeader>
        <div className="py-2 space-y-2">
          <p>
            <strong>Title:</strong> {viewingDoc.title}
          </p>
          <p>
            <strong>Category:</strong> {viewingDoc.category}
          </p>
          <p>
            <strong>File:</strong> {viewingDoc.fileName}
          </p>
          <p>
            <strong>Uploaded:</strong>{' '}
            {viewingDoc.uploadedAt.toLocaleDateString()}
          </p>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setViewingDoc(null)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )}
</div>
  )
}