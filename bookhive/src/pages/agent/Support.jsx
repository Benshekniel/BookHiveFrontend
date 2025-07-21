import { useState } from 'react'
import { HelpCircle, Phone, Mail, MessageCircle, FileText, Video } from 'lucide-react'

export default function Support() {
  const [activeTab, setActiveTab] = useState('contact')
  const [supportForm, setSupportForm] = useState({
    category: '',
    subject: '',
    message: '',
    priority: 'medium'
  })

  const supportCategories = [
    'Delivery Issues',
    'Technical Problems',
    'Account Questions',
    'Payment Issues',
    'Hub Operations',
    'Other'
  ]

  const faqs = [
    {
      question: 'How do I update my delivery status?',
      answer: 'You can update your delivery status in the Delivery page by clicking on the status dropdown and selecting the appropriate status.'
    },
    {
      question: 'What should I do if a customer is not available?',
      answer: 'If a customer is not available, follow the standard protocol: attempt contact via phone, leave a delivery notice, and update the status to "attempted delivery".'
    },
    {
      question: 'How do I report a damaged package?',
      answer: 'Report damaged packages immediately through the Support page or call the emergency hotline. Take photos of the damage and complete an incident report.'
    },
    {
      question: 'Can I change my assigned hub?',
      answer: 'Hub reassignment requests must be submitted through your manager or HR department. Include the reason for the request and preferred hub location.'
    }
  ]

  const handleFormSubmit = (e) => {
    e.preventDefault()
    console.log('Support ticket submitted:', supportForm)
    // Reset form
    setSupportForm({ category: '', subject: '', message: '', priority: 'medium' })
    alert('Support ticket submitted successfully!')
  }

  return (
    <div className="space-y-6 p-2 bg-gray-50 min-h-screen">

      {/* Quick Contact Options */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <Phone className="text-[#3B82F6] mx-auto mb-3" size={32} />
          <h3 className="font-semibold text-[#0F172A] mb-2">Emergency Hotline</h3>
          <p className="text-sm text-[#0F172A]/60 mb-3">For urgent delivery issues</p>
          <p className="text-[#3B82F6] font-medium">1-800-DELIVERY</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <Mail className="text-[#FBBF24] mx-auto mb-3" size={32} />
          <h3 className="font-semibold text-[#0F172A] mb-2">Email Support</h3>
          <p className="text-sm text-[#0F172A]/60 mb-3">Response within 24 hours</p>
          <p className="text-[#FBBF24] font-medium">support@deliveryhub.com</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <Video className="text-[#22C55E] mx-auto mb-3" size={32} />
          <h3 className="font-semibold text-[#0F172A] mb-2">Live Chat</h3>
          <p className="text-sm text-[#0F172A]/60 mb-3">Instant assistance available</p>
          <button className="bg-[#22C55E] text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
            Start Chat
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('contact')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'contact'
                  ? 'border-[#3B82F6] text-[#3B82F6]'
                  : 'border-transparent text-[#0F172A]/60 hover:text-[#0F172A]'
              }`}
            >
              Contact Support
            </button>
            <button
              onClick={() => setActiveTab('faq')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'faq'
                  ? 'border-[#3B82F6] text-[#3B82F6]'
                  : 'border-transparent text-[#0F172A]/60 hover:text-[#0F172A]'
              }`}
            >
              FAQ
            </button>
            <button
              onClick={() => setActiveTab('resources')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'resources'
                  ? 'border-[#3B82F6] text-[#3B82F6]'
                  : 'border-transparent text-[#0F172A]/60 hover:text-[#0F172A]'
              }`}
            >
              Resources
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'contact' && (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-2">
                    Category
                  </label>
                  <select
                    value={supportForm.category}
                    onChange={(e) => setSupportForm({ ...supportForm, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                    required
                  >
                    <option value="">Select a category</option>
                    {supportCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-2">
                    Priority
                  </label>
                  <select
                    value={supportForm.priority}
                    onChange={(e) => setSupportForm({ ...supportForm, priority: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={supportForm.subject}
                  onChange={(e) => setSupportForm({ ...supportForm, subject: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                  placeholder="Brief description of your issue"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-2">
                  Message
                </label>
                <textarea
                  value={supportForm.message}
                  onChange={(e) => setSupportForm({ ...supportForm, message: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                  placeholder="Please provide detailed information about your issue"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-[#3B82F6] text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Submit Ticket
              </button>
            </form>
          )}

          {activeTab === 'faq' && (
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-[#0F172A] flex items-center">
                    <HelpCircle className="text-[#3B82F6] mr-2" size={16} />
                    {faq.question}
                  </h3>
                  <p className="text-sm text-[#0F172A]/80 mt-2 ml-6">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'resources' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-[#0F172A]">
                  Documentation
                </h3>
                <div className="space-y-2">
                  <a href="#" className="flex items-center p-3 bg-[#F8FAFC] rounded-lg hover:bg-gray-100 transition-colors">
                    <FileText className="text-[#3B82F6] mr-3" size={20} />
                    <div>
                      <p className="text-sm font-medium text-[#0F172A]">Delivery Agent Handbook</p>
                      <p className="text-xs text-[#0F172A]/60">Complete guide for delivery agents</p>
                    </div>
                  </a>
                  <a href="#" className="flex items-center p-3 bg-[#F8FAFC] rounded-lg hover:bg-gray-100 transition-colors">
                    <FileText className="text-[#3B82F6] mr-3" size={20} />
                    <div>
                      <p className="text-sm font-medium text-[#0F172A]">Safety Protocols</p>
                      <p className="text-xs text-[#0F172A]/60">Safety guidelines and procedures</p>
                    </div>
                  </a>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold text-[#0F172A]">
                  Training Materials
                </h3>
                <div className="space-y-2">
                  <a href="#" className="flex items-center p-3 bg-[#F8FAFC] rounded-lg hover:bg-gray-100 transition-colors">
                    <Video className="text-[#22C55E] mr-3" size={20} />
                    <div>
                      <p className="text-sm font-medium text-[#0F172A]">Customer Service Training</p>
                      <p className="text-xs text-[#0F172A]/60">Video tutorials and best practices</p>
                    </div>
                  </a>
                  <a href="#" className="flex items-center p-3 bg-[#F8FAFC] rounded-lg hover:bg-gray-100 transition-colors">
                    <Video className="text-[#22C55E] mr-3" size={20} />
                    <div>
                      <p className="text-sm font-medium text-[#0F172A]">App Usage Guide</p>
                      <p className="text-xs text-[#0F172A]/60">How to use the delivery app effectively</p>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}