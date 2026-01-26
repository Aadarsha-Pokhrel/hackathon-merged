import HeroMemberCard from '../components/HeroMemberCard.jsx'
// import { loans } from "../data/dummydata.js";
import LoanCard from '../components/LoanCard';
import "./Home.css";


const Home = ({ user }) => {  // Accept user prop from App.jsx
    
    // const currentMemberId = user?.id || 1;
    // const myLoans = loans.filter((loan) => loan.memberId === currentMemberId);

    console.log("user = ",user);
  return (
  <>
      <div className="hero-container">
        <div className="hero-content">
          <h2 className="hero-title">
            Welcome, {user?.name || "User"}!
          </h2>

          {/* Hero Cards */}
          <div className="hero-cards">
            <HeroMemberCard title="Total Deposits" value="NPR 120,000" />
            <HeroMemberCard title="Active Loans" value= '1' />
            <HeroMemberCard title="Total Borrowed" value="NPR 40,000" />
          </div>

          {/* Active Loans Section */}
          <div className="active-loans">
            <div className="active-loans-header">
              <h2>My Active Loans</h2>
            </div>
            <div className="active-loans-body">
              {user.loansTaken=== 0 ? (
                <p className="no-loans">No active loans</p>
              ) : (
                <div className="loans-list">
                    <LoanCard key={user.userId} user={user} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
  </>
  )
}

export default Home

