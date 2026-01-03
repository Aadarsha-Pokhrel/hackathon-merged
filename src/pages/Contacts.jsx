import { contacts } from '../data/dummydata';

const Contacts = ({ user }) => {
  // If member is logged in, you might want to filter out their own contact
  // or show all contacts. For now, showing all contacts.
  const displayContacts = user?.role === 'member' 
    ? contacts.filter(contact => contact.id !== user.id) // Don't show own contact
    : contacts; // Admin sees all contacts

  return (
    // Add left margin for sidebar and top padding for navbar
    <div className="ml-64 md:ml-40 px-4 pt-28">
      <h2 className="text-xl font-bold mb-4 text-center">
        {user?.role === 'admin' ? 'All Member Contacts' : 'Group Member Contacts'}
      </h2>

      <div className="space-y-4 max-w-6xl mx-auto">
        {displayContacts.length === 0 ? (
          <p className="text-center text-gray-500">No contacts found.</p>
        ) : (
          displayContacts.map(contact => (
            <div
              key={contact.id}
              className="flex items-center gap-4 p-4 border rounded-lg shadow-sm bg-white hover:shadow-md transition"
            >
              <img
                src={contact.avatar}
                alt={contact.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <p className="font-semibold text-gray-800">{contact.name}</p>
                <p className="text-sm text-gray-500">
                  {contact.phone} | {contact.email}
                </p>
                <p
                  className={`text-xs font-medium ${
                    contact.status === 'active' ? 'text-green-600' : 'text-gray-400'
                  }`}
                >
                  {contact.status === 'active' ? '● Active' : '○ Inactive'}
                </p>
              </div>
              
              {/* Optional: Add action buttons */}
              {user?.role === 'admin' && (
                <div className="flex gap-2">
                  <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                    Edit
                  </button>
                  <button className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition">
                    View Details
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Contacts;

