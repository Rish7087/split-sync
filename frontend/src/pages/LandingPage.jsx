import { useNavigate } from 'react-router-dom';

const profiles = [
  { id: 1, name: 'User 1' },
  { id: 2, name: 'User 2' },
  { id: 3, name: 'User 3' },
  { id: 4, name: 'User 4' }
];

export default function LandingPage() {
  const navigate = useNavigate();

  const handleProfileSelect = (id) => {
    localStorage.setItem('selectedProfile', id);
    navigate('/login');
  };

  return (
    <div>
      <h1>Select Your Profile</h1>
      <div className="profile-grid">
        {profiles.map(profile => (
          <button key={profile.id} onClick={() => handleProfileSelect(profile.id)}>
            {profile.name}
          </button>
        ))}
      </div>
    </div>
  );
}
