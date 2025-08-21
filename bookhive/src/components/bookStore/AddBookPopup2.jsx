import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, X } from 'lucide-react';

// Reusable Input Components
const FormInput = ({ 
  label, 
  register,
  name,
  errors,
  type = "text", 
  placeholder, 
  required = false, 
  helpText,
  className = "",
  validation = {},
  ...props 
}) => (
  <div className={className}>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      {...register(name, { required: required && `${label} is required`, ...validation })}
      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
        errors[name] ? 'border-red-500' : 'border-gray-300'
      }`}
      placeholder={placeholder}
      {...props}
    />
    {errors[name] && <p className="text-xs text-red-500 mt-1">{errors[name].message}</p>}
    {helpText && !errors[name] && <p className="text-xs text-gray-500 mt-1">{helpText}</p>}
  </div>
);

const FormSelect = ({ 
  label, 
  register,
  name,
  errors,
  options, 
  required = false, 
  className = "",
  validation = {},
  ...props 
}) => (
  <div className={className}>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      {...register(name, { required: required && `${label} is required`, ...validation })}
      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
        errors[name] ? 'border-red-500' : 'border-gray-300'
      }`}
      {...props}
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {errors[name] && <p className="text-xs text-red-500 mt-1">{errors[name].message}</p>}
  </div>
);

const FormTextarea = ({ 
  label, 
  register,
  name,
  errors,
  placeholder, 
  required = false, 
  rows = 4,
  className = "",
  validation = {},
  ...props 
}) => (
  <div className={className}>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <textarea
      {...register(name, { required: required && `${label} is required`, ...validation })}
      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
        errors[name] ? 'border-red-500' : 'border-gray-300'
      }`}
      rows={rows}
      placeholder={placeholder}
      {...props}
    />
    {errors[name] && <p className="text-xs text-red-500 mt-1">{errors[name].message}</p>}
  </div>
);

const FormSection = ({ title, children, className = "" }) => (
  <div className={`bg-gray-50 rounded-xl p-6 ${className}`}>
    <h4 className="text-lg font-semibold text-gray-900 mb-4">{title}</h4>
    {children}
  </div>
);

const AddBookPopup = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [bookCover, setBookCover] = useState('');

  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm({
    defaultValues: {
      title: '',
      authors: '',
      genres: '',
      condition: 'NEW',
      description: '',
      status: 'AVAILABLE',
      listingType: 'SELL_ONLY',
      sellingPrice: '',
      lendingPrice: '',
      depositAmount: '',
      isbn: '',
      publisher: '',
      publishedYear: '',
      language: 'English',
      pageCount: '',
      lendingPeriod: 7,
      bookCount: 1,
      tags: '',
      seriesName: '',
      seriesNumber: '',
      totalBooksInSeries: '',
      location: ''
    }
  });

  // Form options
  const conditionOptions = [
    { value: 'NEW', label: 'New - Never been read' },
    { value: 'USED', label: 'Used - Good readable condition' },
    { value: 'FAIR', label: 'Fair - Shows wear but readable' }
  ];

  const languageOptions = [
    { value: 'English', label: 'English' },
    { value: 'Sinhala', label: 'Sinhala' },
    { value: 'Tamil', label: 'Tamil' },
    { value: 'Other', label: 'Other' }
  ];

  const listingTypeOptions = [
    { value: 'SELL_ONLY', label: 'Sell Only' },
    { value: 'LEND_ONLY', label: 'Lend Only' },
    { value: 'SELL_AND_LEND', label: 'Sell & Lend' },
    { value: 'EXCHANGE', label: 'Exchange' },
    { value: 'DONATE', label: 'Donate' }
  ];

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      console.log('Form data to submit:', data);

      // Submit to API
      const response = await fetch('http://localhost:9090/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Id': '1',
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorData}`);
      }

      const createdBook = await response.json();
      console.log('Book created successfully:', createdBook);
      
      alert('Book added successfully!');
      
      // Reset form and close modal
      reset();
      setBookCover('');
      setShowAddModal(false);
      
    } catch (error) {
      console.error('Error adding book:', error);
      alert(`Error adding book: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setBookCover(reader.result);
        setValue('imageUrls', file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const closeModal = () => {
    setShowAddModal(false);
    reset();
    setBookCover('');
  };

  return (
    <>
      {/* Add Book Button */}
      <button 
        onClick={() => setShowAddModal(true)}
        className="flex items-center space-x-2 px-4 py-2 bg-amber-400 text-slate-800 rounded-lg hover:bg-amber-500 transition-colors duration-200 font-medium"
      >
        <Plus className="w-4 h-4" />
        <span>Add Book</span>
      </button>

      {/* Modal Overlay */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Add New Book</h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="p-6">
              <div className="space-y-4">
                {/* Basic Information */}
                <FormSection title="Basic Information">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                      label="Book Title"
                      name="title"
                      register={register}
                      errors={errors}
                      placeholder="Enter book title"
                      required
                    />
                    <FormInput
                      label="Authors"
                      name="authors"
                      register={register}
                      errors={errors}
                      placeholder="Author names (comma-separated)"
                      helpText="Separate multiple authors with commas"
                      required
                    />
                    <FormInput
                      label="Publication Year"
                      name="publishedYear"
                      type="number"
                      register={register}
                      errors={errors}
                      placeholder="e.g., 2023"
                      validation={{
                        min: { value: 1000, message: "Year must be after 1000" },
                        max: { value: new Date().getFullYear(), message: "Year cannot be in the future" }
                      }}
                    />
                    <FormInput
                      label="ISBN (Optional)"
                      name="isbn"
                      register={register}
                      errors={errors}
                      placeholder="978-0-123456-78-9"
                    />
                    <FormInput
                      label="Publisher"
                      name="publisher"
                      register={register}
                      errors={errors}
                      placeholder="Publisher name"
                    />
                    <FormInput
                      label="Page Count"
                      name="pageCount"
                      type="number"
                      register={register}
                      errors={errors}
                      placeholder="Number of pages"
                      validation={{
                        min: { value: 1, message: "Page count must be at least 1" }
                      }}
                    />
                  </div>
                  <FormTextarea
                    label="Description"
                    name="description"
                    register={register}
                    errors={errors}
                    placeholder="Tell potential readers about this book - plot summary, condition details, why you're sharing it..."
                    className="mt-4"
                  />
                </FormSection>

                {/* Image Upload */}
                <FormSection title="Book Image">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Book Cover <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">Upload a clear image of the book cover (JPEG, PNG, max 5MB)</p>
                    </div>
                    {bookCover && (
                      <div className="flex-shrink-0">
                        <img
                          src={bookCover}
                          alt="Book cover preview"
                          className="w-32 h-40 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setBookCover('');
                            setValue('imageUrls', '');
                          }}
                          className="mt-2 text-sm text-red-500 hover:text-red-700 underline"
                        >
                          Remove Image
                        </button>
                      </div>
                    )}
                  </div>
                </FormSection>

                {/* Categories and Details */}
                <FormSection title="Categories & Details">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormInput
                      label="Genres"
                      name="genres"
                      register={register}
                      errors={errors}
                      placeholder="Fiction, Romance, Thriller"
                      helpText="Separate multiple genres with commas"
                      required
                    />
                    <FormSelect
                      label="Condition"
                      name="condition"
                      register={register}
                      errors={errors}
                      options={conditionOptions}
                      required
                    />
                    <FormSelect
                      label="Language"
                      name="language"
                      register={register}
                      errors={errors}
                      options={languageOptions}
                    />
                  </div>
                </FormSection>

                {/* Availability & Pricing */}
                <FormSection title="Availability & Pricing">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <FormSelect
                      label="Listing Type"
                      name="listingType"
                      register={register}
                      errors={errors}
                      options={listingTypeOptions}
                      required
                    />
                    <FormInput
                      label="Book Count"
                      name="bookCount"
                      type="number"
                      register={register}
                      errors={errors}
                      placeholder="1"
                      validation={{
                        min: { value: 1, message: "Book count must be at least 1" }
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormInput
                      label="Selling Price (LKR)"
                      name="sellingPrice"
                      type="number"
                      register={register}
                      errors={errors}
                      placeholder="Enter price if selling"
                      validation={{
                        min: { value: 0, message: "Price cannot be negative" }
                      }}
                      step="0.01"
                    />
                    <FormInput
                      label="Lending Price (LKR)"
                      name="lendingPrice"
                      type="number"
                      register={register}
                      errors={errors}
                      placeholder="Daily/weekly rate"
                      validation={{
                        min: { value: 0, message: "Price cannot be negative" }
                      }}
                      step="0.01"
                    />
                    <FormInput
                      label="Deposit Amount (LKR)"
                      name="depositAmount"
                      type="number"
                      register={register}
                      errors={errors}
                      placeholder="Security deposit"
                      validation={{
                        min: { value: 0, message: "Deposit cannot be negative" }
                      }}
                      step="0.01"
                    />
                  </div>

                  <FormInput
                    label="Lending Period (days)"
                    name="lendingPeriod"
                    type="number"
                    register={register}
                    errors={errors}
                    placeholder="7"
                    validation={{
                      min: { value: 1, message: "Lending period must be at least 1 day" }
                    }}
                    className="mt-4 w-full md:w-48"
                  />
                </FormSection>

                {/* Series & Tags */}
                <FormSection title="Series & Tags">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <FormInput
                      label="Series Name"
                      name="seriesName"
                      register={register}
                      errors={errors}
                      placeholder="e.g., Harry Potter"
                    />
                    <FormInput
                      label="Series Number"
                      name="seriesNumber"
                      type="number"
                      register={register}
                      errors={errors}
                      placeholder="1"
                      validation={{
                        min: { value: 1, message: "Series number must be at least 1" }
                      }}
                    />
                    <FormInput
                      label="Total Books in Series"
                      name="totalBooksInSeries"
                      type="number"
                      register={register}
                      errors={errors}
                      placeholder="7"
                      validation={{
                        min: { value: 1, message: "Total books must be at least 1" }
                      }}
                    />
                  </div>

                  <FormInput
                    label="Tags (Optional)"
                    name="tags"
                    register={register}
                    errors={errors}
                    placeholder="classic, must-read, vintage"
                    helpText="Help others discover your book with relevant tags (comma-separated)"
                  />
                </FormSection>

                {/* Form Actions */}
                <div className="flex gap-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Adding Book...' : 'Add Book to Library'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddBookPopup;