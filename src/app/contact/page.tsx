import ContactBackground from '@/components/contact/ContactBackground';
import ContactContent from '@/components/contact/ContactContent';

export default function Contact() {
  return (
    <div className="min-h-screen relative">
      <ContactBackground />
      <ContactContent />
    </div>
  );
}
