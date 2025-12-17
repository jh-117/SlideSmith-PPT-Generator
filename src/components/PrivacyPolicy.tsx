import { ArrowLeft, Shield, Layers } from 'lucide-react';
import React from 'react';

function PrivacyPolicy({ onBack, onHomeClick }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div 
            className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={onHomeClick}
          >
            <div className="bg-indigo-600 p-2 rounded-lg shadow-sm">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">SlideSmith AI</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-grow py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center space-x-3 mb-6">
              <Shield className="w-10 h-10 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
            </div>

            <div className="prose prose-sm max-w-none space-y-6">
              <p className="text-sm text-gray-600">
                <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
              </p>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Introduction</h2>
                <p className="text-gray-700">
                  SlideSmith AI ("the Service") is an AI-powered 5-slide deck builder that helps 
                  teams create polished, company-standard presentations. This privacy policy explains 
                  how we collect, use, and protect your information.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Information We Collect</h2>
                
                <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">User Input Data:</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li><strong>Brief Information:</strong> Audience, objective, key message points, and supporting data bullets</li>
                  <li><strong>Deck Content:</strong> Slide titles, bullet points, speaker notes, and narrative flow</li>
                  <li><strong>Version History:</strong> Change notes and version data for your decks</li>
                  <li><strong>Customization Preferences:</strong> Your editing choices and applied slide rules</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">Usage Information:</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li><strong>Anonymous Usage Data:</strong> General statistics about feature usage and performance</li>
                  <li><strong>Session Information:</strong> Temporary data during your active session</li>
                  <li><strong>Deck Metadata:</strong> Timestamps, version counts, and edit frequency (anonymized)</li>
                </ul>

                <p className="text-gray-700 mt-4 p-4 bg-blue-50 rounded-lg">
                  <strong>Important:</strong> We do <strong>not</strong> collect:
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Personal identification information (name, email, company details)</li>
                    <li>Payment information (our service is free)</li>
                    <li>User accounts or login credentials</li>
                    <li>Contact information or demographic data</li>
                    <li>Collaborator information (MVP is single-user only)</li>
                  </ul>
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">3. How We Use Your Information</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li><strong>Deck Generation:</strong> To create 5-slide deck outlines based on your brief</li>
                  <li><strong>AI Processing:</strong> To analyze your brief and generate company-standard slide content</li>
                  <li><strong>Version Management:</strong> To save and organize your deck versions with change notes</li>
                  <li><strong>Slide Rule Application:</strong> To apply company slide rules (word limits, formatting guidelines)</li>
                  <li><strong>Improvement:</strong> To enhance our AI models and service quality</li>
                  <li><strong>Temporary Storage:</strong> To maintain your session while creating and editing decks</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Data Processing & AI Services</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li><strong>Kadosh AI/OpenAI:</strong> Your brief and content is processed by AI models to generate slide decks</li>
                  <li><strong>Content Generation:</strong> Inputs are used to create slide titles, bullets, evidence tags, and speaker notes</li>
                  <li><strong>No Training Data:</strong> Your specific inputs are not used to train AI models beyond your immediate session</li>
                  <li><strong>Temporary Processing:</strong> Data is processed in real-time and not stored for future model training</li>
                  <li><strong>Company Standards:</strong> AI applies pre-defined company slide rules (word limits, formatting guidelines)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Data Storage & Retention</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li><strong>Brief Input:</strong> Stored as part of your deck creation process</li>
                  <li><strong>Generated Decks:</strong> Stored in your private workspace for access and editing</li>
                  <li><strong>Version History:</strong> All versions (v1, v2, v3...) are saved with timestamps and change notes</li>
                  <li><strong>Export Data:</strong> Generated outlines are available for export; not stored after download</li>
                  <li><strong>Session Data:</strong> Cleared when you close your browser or end your session</li>
                  <li><strong>Anonymous Analytics:</strong> Aggregated usage statistics retained for service improvement</li>
                  <li><strong>User Ownership:</strong> All your decks are private by default; only you can access them</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Data Security</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Secure transmission using HTTPS/SSL encryption</li>
                  <li>No permanent storage of personal or sensitive information</li>
                  <li>Regular security monitoring and updates</li>
                  <li>Automatic data cleanup of temporary files</li>
                  <li>Private workspace isolation (users cannot access others' decks)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Third-Party Services</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li><strong>AI Providers:</strong> Content generation powered by Kadosh AI/OpenAI (subject to their privacy policies)</li>
                  <li><strong>Hosting Services:</strong> Secure cloud infrastructure for application hosting</li>
                  <li><strong>No Data Sharing:</strong> We do not sell, rent, or share your data with third parties for marketing or advertising</li>
                  <li><strong>No Collaboration Tools:</strong> MVP does not include sharing features; all decks remain private</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Your Content & Intellectual Property</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li><strong>Your Briefs:</strong> You retain all rights to the brief information you provide</li>
                  <li><strong>Generated Decks:</strong> You own all slide decks generated from your inputs</li>
                  <li><strong>Version History:</strong> You own all versions (v1, v2, v3...) of your decks</li>
                  <li><strong>AI-Generated Content:</strong> Content created by AI is provided for your use without restrictions</li>
                  <li><strong>Export Rights:</strong> You can export PPT outlines and copy-ready blocks for use in presentation software</li>
                  <li><strong>Responsibility:</strong> You are responsible for ensuring your inputs and use of generated materials comply with applicable laws</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Single-User Privacy Model</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li><strong>Private by Default:</strong> All decks are automatically private; only you can see them</li>
                  <li><strong>No Sharing:</strong> MVP does not include sharing or collaboration features</li>
                  <li><strong>No Cross-Access:</strong> Users cannot view, edit, or export decks created by others</li>
                  <li><strong>No Admin Oversight:</strong> No organizational or admin access to user content</li>
                  <li><strong>Your Workspace:</strong> Each user has a completely isolated, private workspace</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Children's Privacy</h2>
                <p className="text-gray-700">
                  Our service is intended for professional business use and is not designed for 
                  or directed at children under 18 years of age. We do not knowingly collect any 
                  information from children.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">11. Changes to This Policy</h2>
                <p className="text-gray-700">
                  We may update this privacy policy to reflect changes in our practices or legal requirements. 
                  The updated version will be posted here with a revised "Last Updated" date. 
                  We encourage you to review this policy periodically.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">12. Contact Information</h2>
                <p className="text-gray-700">
                  If you have any questions about this Privacy Policy or our data practices, please contact:<br />
                  <strong>Email:</strong> privacy@slidesmith.ai<br />
                  <strong>Website:</strong> slidesmith.ai
                </p>
              </section>

              <section className="mt-8 p-4 bg-gray-50 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Quick Summary</h2>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ <strong>No accounts required</strong> - use instantly without registration</li>
                  <li>✓ <strong>No personal data collected</strong> - we don't ask for names or emails</li>
                  <li>✓ <strong>Private by default</strong> - all your decks are visible only to you</li>
                  <li>✓ <strong>You own everything</strong> - your briefs, decks, and versions are yours</li>
                  <li>✓ <strong>Version control</strong> - v1, v2, v3... all saved with your change notes</li>
                  <li>✓ <strong>100% anonymous</strong> - no tracking or user profiling</li>
                  <li>✓ <strong>Secure export</strong> - download PPT outlines and copy-ready blocks</li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicy;