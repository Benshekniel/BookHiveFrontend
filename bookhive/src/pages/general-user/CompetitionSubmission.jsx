import React, { useState, useRef, useEffect } from "react";
import { X, Send, CheckCircle } from "lucide-react";
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';
import { useAuth } from '../../components/AuthContext';

const CompetitionSubmission = ({
  selectedCompetition,
  showSubmissionModal,
  setShowSubmissionModal,
  onSubmit,
  setSelectedCompetition,
  setActiveTab
}) => {
  const [submissionForm, setSubmissionForm] = useState({
    title: "",
    content: "",
    wordCount: 0,
  });
  const [editorContent, setEditorContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [draftLoaded, setDraftLoaded] = useState(false);
  const [draftSubmissionId, setDraftSubmissionId] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false); // New state for success message
  const editorRef = useRef(null);
  const { user } = useAuth();

  // Fetch existing draft when competition is selected
  useEffect(() => {
    const fetchExistingDraft = async () => {
      if (selectedCompetition && user && !draftLoaded) {
        try {
          setIsLoading(true);
          setSubmitError(null);
          
          const response = await axios.get(
            `http://localhost:9090/api/user/getDraftSubmission`, 
            {
              params: {
                competitionId: selectedCompetition.id,
                email: user.email
              },
              headers: {
                'Content-Type': 'application/json',
              }
            }
          );
          
          console.log("Existing draft response:", response.data);
          
          // Check if a draft exists
          if (response.data && response.data.message === 'success') {
            const draftSubmission = response.data.submission;
            
            // Save the submission ID for updates
            setDraftSubmissionId(draftSubmission.submissionId);
            console.log("Loaded draft with ID:", draftSubmission.submissionId);
            
            // Calculate word count from HTML content
            const contentText = draftSubmission.content || "";
            const textOnly = contentText.replace(/<[^>]*>/g, ' ');
            const words = textOnly.split(/\s+/).filter(word => word.length > 0);
            const wordCount = words.length;
            
            // Set editor content separately
            setEditorContent(draftSubmission.content || "");
            
            // Populate form with existing draft
            setSubmissionForm({
              title: draftSubmission.title || "",
              content: draftSubmission.content || "",
              wordCount: wordCount
            });
          } else {
            // Reset form if no draft exists
            setDraftSubmissionId(null);
            setEditorContent("");
            setSubmissionForm({
              title: "",
              content: "",
              wordCount: 0
            });
          }
          
          setDraftLoaded(true);
        } catch (error) {
          console.error("Error fetching draft:", error);
          setSubmitError('Failed to fetch draft: ' + (error.response?.data?.message || error.message));
        } finally {
          setIsLoading(false);
        }
      }
    };

    if (showSubmissionModal && !draftLoaded) {
      fetchExistingDraft();
    }
    
    if (!showSubmissionModal) {
      setDraftLoaded(false);
      setSaveSuccess(false); // Reset success state when modal closes
    }
  }, [selectedCompetition, showSubmissionModal, user, draftLoaded]);

  const handleSubmissionChange = (field, value) => {
    if (field === "content") {
      // Calculate word count from HTML content
      const textOnly = value.replace(/<[^>]*>/g, ' ');
      const words = textOnly.split(/\s+/).filter(word => word.length > 0);
      
      setSubmissionForm((prev) => ({
        ...prev,
        content: value,
        wordCount: words.length,
      }));
    } else {
      setSubmissionForm((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleClose = () => {
    // Reset all states
    setShowSubmissionModal(false);
    setSubmissionForm({ title: "", content: "", wordCount: 0 });
    setEditorContent("");
    setSelectedCompetition(null);
    setSubmitError(null);
    setDraftLoaded(false);
    setDraftSubmissionId(null);
    setSaveSuccess(false);
  };

  const handleSubmitEntry = async () => {
    if (selectedCompetition && submissionForm.title && submissionForm.content) {
      setIsSubmitting(true);
      setSubmitError(null);
      setSaveSuccess(false);
      
      try {
        const submissionData = {
          submissionId: draftSubmissionId,
          competitionId: selectedCompetition.id,
          email: user.email,
          userId: user.userId,
          title: submissionForm.title,
          content: submissionForm.content
        };
        
        console.log("Submitting with data:", { 
          submissionId: draftSubmissionId,
          email: user.email, 
          userId: user.userId,
          competitionId: selectedCompetition.id,
          title: submissionForm.title.substring(0, 20) + "..."
        });
        
        const response = await axios.post(
          'http://localhost:9090/api/userSaveStory', 
          submissionData,
          {
            headers: {
              'Content-Type': 'application/json',
            }
          }
        );
        
        console.log("Raw response:", response.data);
        
        // Simplified response handling
        let result = response.data;
        
        // If it's a string, try to parse it
        if (typeof result === 'string') {
          try {
            result = JSON.parse(result);
          } catch (e) {
            console.error("Failed to parse response string:", e);
          }
        }
        
        // Check if message is nested in another object
        if (result.message && typeof result.message === 'string') {
          try {
            const parsedMessage = JSON.parse(result.message);
            if (parsedMessage && typeof parsedMessage === 'object') {
              result = parsedMessage;
            }
          } catch (e) {
            // Not a JSON string, keep original result
          }
        }
        
        console.log("Processed result:", result);
        
        // Check for success message
        if (result && result.message === 'success') {
          // Save the submission ID for future updates
          if (result.submissionId) {
            setDraftSubmissionId(result.submissionId);
            console.log("Saved submission with ID:", result.submissionId);
          }
          
          // Create a formatted submission object to add to the local state
          const newSubmission = {
            id: result.submissionId || draftSubmissionId || Date.now().toString(),
            title: submissionForm.title,
            competitionId: selectedCompetition.id,
            status: "Draft",
            submittedAt: null,
            wordCount: submissionForm.wordCount,
            votes: 0,
            content: submissionForm.content,
            feedback: null,
            ranking: null,
            totalEntries: null
          };
          
          // Update parent component with new submission without navigating
          onSubmit(newSubmission);
          console.log("Entry saved successfully:", newSubmission);
          
          // Show success message
          setSaveSuccess(true);
          
          // Close after delay
          setTimeout(() => {
            handleClose();
          }, 1500); // 1.5 second delay
          
        } else {
          // Handle error case
          const errorMsg = result && result.error ? result.error : "Unknown error occurred";
          setSubmitError('Failed to submit entry: ' + errorMsg);
        }
      } catch (error) {
        console.error("Error submitting entry:", error);
        setSubmitError('Error submitting entry: ' + (error.response?.data?.message || error.message));
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const isDeadlinePassed = (deadline) => {
    const deadlineDate = new Date(deadline);
    const currentDate = new Date("2025-09-03");
    return deadlineDate < currentDate;
  };

  if (!showSubmissionModal || !selectedCompetition) return null;

  return (
    <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold mb-2">
                {draftSubmissionId ? "Continue Draft" : "Create Entry"}
              </h3>
              <p className="text-gray-600">{selectedCompetition.title}</p>
              {draftSubmissionId && (
                <p className="text-xs text-blue-500">Editing existing draft (ID: {draftSubmissionId.substring(0, 6)}...)</p>
              )}
            </div>
            <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>

          {isLoading && (
            <div className="flex items-center justify-center mb-4">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-2 text-gray-600">Loading draft...</span>
            </div>
          )}

          {submitError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {submitError}
            </div>
          )}
          
          {/* Success message */}
          {saveSuccess && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm flex items-center">
              <CheckCircle size={18} className="mr-2 text-green-600" />
              {draftSubmissionId ? "Draft updated successfully!" : "Draft saved successfully!"}
            </div>
          )}
          
          {!isLoading && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Entry Title
                </label>
                <input
                  type="text"
                  value={submissionForm.title}
                  onChange={(e) => handleSubmissionChange("title", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your submission title..."
                  disabled={saveSuccess}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Entry
                </label>
                <Editor
                  apiKey="bt1w2ivk1v3fqe0n5lkisczo8gbyjwgw0tp7ur75kmuxobvb"
                  onInit={(evt, editor) => {
                    editorRef.current = editor;
                    if (draftLoaded && editorContent) {
                      editor.setContent(editorContent);
                    }
                  }}
                  value={editorContent}
                  onEditorChange={(content) => {
                    setEditorContent(content);
                    handleSubmissionChange("content", content);
                  }}
                  disabled={saveSuccess}
                  init={{
                    height: 350,
                    menubar: false,
                    plugins: [
                      'advlist', 'autolink', 'lists', 'link', 'charmap', 
                      'searchreplace', 'visualblocks', 'code', 'fullscreen',
                      'insertdatetime', 'table', 'wordcount'
                    ],
                    toolbar: 'undo redo | formatselect | ' +
                      'bold italic underline | alignleft aligncenter ' +
                      'alignright alignjustify | bullist numlist outdent indent | ' +
                      'fontsize | removeformat | help',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                    fontsize_formats: '8pt 10pt 12pt 14pt 16pt 18pt 24pt 36pt 48pt',
                    branding: false,
                    resize: false,
                    statusbar: false,
                    setup: (editor) => {
                      editor.on('init', (e) => {
                        editor.getBody().setAttribute('contenteditable', true);
                      });
                    }
                  }}
                />
                <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
                  <span>Word count: {submissionForm.wordCount}</span>
                  <span>Remember to follow the competition rules</span>
                </div>
              </div>
            </div>
          )}
          
          <div className="mt-6 flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isLoading || saveSuccess}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmitEntry}
              disabled={!submissionForm.title || !submissionForm.content || isDeadlinePassed(selectedCompetition.deadline) || isSubmitting || isLoading || saveSuccess}
              icon={<Send size={16} />}
            >
              {isSubmitting ? (
                <>
                  <span className="mr-2">Saving...</span>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </>
              ) : draftSubmissionId ? "Update Draft" : "Save as Draft"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Button component included for completeness
const Button = ({ children, variant = "primary", size = "md", icon, className = "", onClick, disabled = false, ...props }) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-500 disabled:hover:bg-yellow-500",
    secondary: "bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 focus:ring-blue-500",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500",
    danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 disabled:hover:bg-red-500",
    success: "bg-green-500 text-white hover:bg-green-600 focus:ring-green-500 disabled:hover:bg-green-500",
  };
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`} onClick={onClick} disabled={disabled} {...props}>
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

export default CompetitionSubmission;


// import React, { useState, useRef, useEffect } from "react";
// import { X, Send } from "lucide-react";
// import { Editor } from '@tinymce/tinymce-react';
// import axios from 'axios';
// import { useAuth } from '../../components/AuthContext';

// const CompetitionSubmission = ({
//   selectedCompetition,
//   showSubmissionModal,
//   setShowSubmissionModal,
//   onSubmit,
//   setSelectedCompetition,
//   setActiveTab
// }) => {
//   const [submissionForm, setSubmissionForm] = useState({
//     title: "",
//     content: "",
//     wordCount: 0,
//   });
//   const [editorContent, setEditorContent] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submitError, setSubmitError] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [draftLoaded, setDraftLoaded] = useState(false);
//   const [draftSubmissionId, setDraftSubmissionId] = useState(null);
//   const editorRef = useRef(null);
//   const { user } = useAuth();

//   // Fetch existing draft when competition is selected
//   useEffect(() => {
//     const fetchExistingDraft = async () => {
//       if (selectedCompetition && user && !draftLoaded) {
//         try {
//           setIsLoading(true);
//           setSubmitError(null);
          
//           const response = await axios.get(
//             `http://localhost:9090/api/user/getDraftSubmission`, 
//             {
//               params: {
//                 competitionId: selectedCompetition.id,
//                 email: user.email
//               },
//               headers: {
//                 'Content-Type': 'application/json',
//               }
//             }
//           );
          
//           console.log("Existing draft response:", response.data);
          
//           // Check if a draft exists
//           if (response.data && response.data.message === 'success') {
//             const draftSubmission = response.data.submission;
            
//             // Save the submission ID for updates
//             setDraftSubmissionId(draftSubmission.submissionId);
//             console.log("Loaded draft with ID:", draftSubmission.submissionId);
            
//             // Calculate word count from HTML content
//             const contentText = draftSubmission.content || "";
//             const textOnly = contentText.replace(/<[^>]*>/g, ' ');
//             const words = textOnly.split(/\s+/).filter(word => word.length > 0);
//             const wordCount = words.length;
            
//             // Set editor content separately
//             setEditorContent(draftSubmission.content || "");
            
//             // Populate form with existing draft
//             setSubmissionForm({
//               title: draftSubmission.title || "",
//               content: draftSubmission.content || "",
//               wordCount: wordCount
//             });
//           } else {
//             // Reset form if no draft exists
//             setDraftSubmissionId(null);
//             setEditorContent("");
//             setSubmissionForm({
//               title: "",
//               content: "",
//               wordCount: 0
//             });
//           }
          
//           setDraftLoaded(true);
//         } catch (error) {
//           console.error("Error fetching draft:", error);
//           setSubmitError('Failed to fetch draft: ' + (error.response?.data?.message || error.message));
//         } finally {
//           setIsLoading(false);
//         }
//       }
//     };

//     if (showSubmissionModal && !draftLoaded) {
//       fetchExistingDraft();
//     }
    
//     if (!showSubmissionModal) {
//       setDraftLoaded(false);
//     }
//   }, [selectedCompetition, showSubmissionModal, user, draftLoaded]);

//   const handleSubmissionChange = (field, value) => {
//     if (field === "content") {
//       // Calculate word count from HTML content
//       const textOnly = value.replace(/<[^>]*>/g, ' ');
//       const words = textOnly.split(/\s+/).filter(word => word.length > 0);
      
//       setSubmissionForm((prev) => ({
//         ...prev,
//         content: value,
//         wordCount: words.length,
//       }));
//     } else {
//       setSubmissionForm((prev) => ({
//         ...prev,
//         [field]: value,
//       }));
//     }
//   };

//   const handleClose = () => {
//     setShowSubmissionModal(false);
//     setSubmissionForm({ title: "", content: "", wordCount: 0 });
//     setEditorContent("");
//     setSelectedCompetition(null);
//     setSubmitError(null);
//     setDraftLoaded(false);
//     setDraftSubmissionId(null);
//   };

//   const handleSubmitEntry = async () => {
//     if (selectedCompetition && submissionForm.title && submissionForm.content) {
//       setIsSubmitting(true);
//       setSubmitError(null);
      
//       try {
//         const submissionData = {
//           submissionId: draftSubmissionId,
//           competitionId: selectedCompetition.id,
//           email: user.email,
//           userId: user.userId,
//           title: submissionForm.title,
//           content: submissionForm.content
//         };
        
//         console.log("Submitting with data:", { 
//           submissionId: draftSubmissionId,
//           email: user.email, 
//           userId: user.userId,
//           competitionId: selectedCompetition.id,
//           title: submissionForm.title.substring(0, 20) + "..."
//         });
        
//         const response = await axios.post(
//           'http://localhost:9090/api/userSaveStory', 
//           submissionData,
//           {
//             headers: {
//               'Content-Type': 'application/json',
//             }
//           }
//         );
        
//         console.log("Raw response:", response.data);
        
//         // Simplified response handling
//         let result = response.data;
        
//         // If it's a string, try to parse it
//         if (typeof result === 'string') {
//           try {
//             result = JSON.parse(result);
//           } catch (e) {
//             console.error("Failed to parse response string:", e);
//           }
//         }
        
//         // Check if message is nested in another object
//         if (result.message && typeof result.message === 'string') {
//           try {
//             const parsedMessage = JSON.parse(result.message);
//             if (parsedMessage && typeof parsedMessage === 'object') {
//               result = parsedMessage;
//             }
//           } catch (e) {
//             // Not a JSON string, keep original result
//           }
//         }
        
//         console.log("Processed result:", result);
        
//         // Check for success message
//         if (result && result.message === 'success') {
//           // Save the submission ID for future updates
//           if (result.submissionId) {
//             setDraftSubmissionId(result.submissionId);
//             console.log("Saved submission with ID:", result.submissionId);
//           }
          
//           // Create a formatted submission object to add to the local state
//           const newSubmission = {
//             id: result.submissionId || draftSubmissionId || Date.now().toString(),
//             title: submissionForm.title,
//             competitionId: selectedCompetition.id,
//             status: "Draft",
//             submittedAt: null,
//             wordCount: submissionForm.wordCount,
//             votes: 0,
//             content: submissionForm.content,
//             feedback: null,
//             ranking: null,
//             totalEntries: null
//           };
          
//           // Update parent component with new submission without navigating
//           onSubmit(newSubmission);
//           console.log("Entry saved successfully:", newSubmission);
          
//           // Simply close the modal without changing tabs
//           handleClose();
//           // REMOVED: setActiveTab("yourSubmissions");
//         } else {
//           // Handle error case
//           const errorMsg = result && result.error ? result.error : "Unknown error occurred";
//           setSubmitError('Failed to submit entry: ' + errorMsg);
//         }
//       } catch (error) {
//         console.error("Error submitting entry:", error);
//         setSubmitError('Error submitting entry: ' + (error.response?.data?.message || error.message));
//       } finally {
//         setIsSubmitting(false);
//       }
//     }
//   };

//   const isDeadlinePassed = (deadline) => {
//     const deadlineDate = new Date(deadline);
//     const currentDate = new Date("2025-09-03");
//     return deadlineDate < currentDate;
//   };

//   if (!showSubmissionModal || !selectedCompetition) return null;

//   return (
//     <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
//         <div className="p-6">
//           <div className="flex justify-between items-start mb-4">
//             <div>
//               <h3 className="text-xl font-bold mb-2">
//                 {draftSubmissionId ? "Continue Draft" : "Create Entry"}
//               </h3>
//               <p className="text-gray-600">{selectedCompetition.title}</p>
//               {draftSubmissionId && (
//                 <p className="text-xs text-blue-500">Editing existing draft (ID: {draftSubmissionId.substring(0, 6)}...)</p>
//               )}
//             </div>
//             <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
//               <X size={24} />
//             </button>
//           </div>

//           {isLoading && (
//             <div className="flex items-center justify-center mb-4">
//               <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
//               <span className="ml-2 text-gray-600">Loading draft...</span>
//             </div>
//           )}

//           {submitError && (
//             <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
//               {submitError}
//             </div>
//           )}
          
//           {!isLoading && (
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Entry Title
//                 </label>
//                 <input
//                   type="text"
//                   value={submissionForm.title}
//                   onChange={(e) => handleSubmissionChange("title", e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   placeholder="Enter your submission title..."
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Your Entry
//                 </label>
//                 <Editor
//                   apiKey="bt1w2ivk1v3fqe0n5lkisczo8gbyjwgw0tp7ur75kmuxobvb"
//                   onInit={(evt, editor) => {
//                     editorRef.current = editor;
//                     if (draftLoaded && editorContent) {
//                       editor.setContent(editorContent);
//                     }
//                   }}
//                   value={editorContent}
//                   onEditorChange={(content) => {
//                     setEditorContent(content);
//                     handleSubmissionChange("content", content);
//                   }}
//                   init={{
//                     height: 350,
//                     menubar: false,
//                     plugins: [
//                       'advlist', 'autolink', 'lists', 'link', 'charmap', 
//                       'searchreplace', 'visualblocks', 'code', 'fullscreen',
//                       'insertdatetime', 'table', 'wordcount'
//                     ],
//                     toolbar: 'undo redo | formatselect | ' +
//                       'bold italic underline | alignleft aligncenter ' +
//                       'alignright alignjustify | bullist numlist outdent indent | ' +
//                       'fontsize | removeformat | help',
//                     content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
//                     fontsize_formats: '8pt 10pt 12pt 14pt 16pt 18pt 24pt 36pt 48pt',
//                     branding: false,
//                     resize: false,
//                     statusbar: false,
//                     setup: (editor) => {
//                       editor.on('init', (e) => {
//                         editor.getBody().setAttribute('contenteditable', true);
//                       });
//                     }
//                   }}
//                 />
//                 <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
//                   <span>Word count: {submissionForm.wordCount}</span>
//                   <span>Remember to follow the competition rules</span>
//                 </div>
//               </div>
//             </div>
//           )}
          
//           <div className="mt-6 flex justify-end space-x-3">
//             <Button
//               variant="outline"
//               onClick={handleClose}
//               disabled={isLoading}
//             >
//               Cancel
//             </Button>
//             <Button
//               variant="primary"
//               onClick={handleSubmitEntry}
//               disabled={!submissionForm.title || !submissionForm.content || isDeadlinePassed(selectedCompetition.deadline) || isSubmitting || isLoading}
//               icon={<Send size={16} />}
//             >
//               {isSubmitting ? (
//                 <>
//                   <span className="mr-2">Saving...</span>
//                   <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                 </>
//               ) : draftSubmissionId ? "Update Draft" : "Save as Draft"}
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Button component included for completeness
// const Button = ({ children, variant = "primary", size = "md", icon, className = "", onClick, disabled = false, ...props }) => {
//   const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
//   const variants = {
//     primary: "bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-500 disabled:hover:bg-yellow-500",
//     secondary: "bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 focus:ring-blue-500",
//     outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500",
//     danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 disabled:hover:bg-red-500",
//     success: "bg-green-500 text-white hover:bg-green-600 focus:ring-green-500 disabled:hover:bg-green-500",
//   };
//   const sizes = {
//     sm: "px-3 py-1.5 text-sm",
//     md: "px-4 py-2 text-sm",
//     lg: "px-6 py-3 text-base",
//   };

//   return (
//     <button className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`} onClick={onClick} disabled={disabled} {...props}>
//       {icon && <span className="mr-2">{icon}</span>}
//       {children}
//     </button>
//   );
// };

// export default CompetitionSubmission;
