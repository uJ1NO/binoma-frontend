import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Vote, 
  Settings, 
  Plus, 
  Check, 
  X, 
  Clock,
  TrendingUp,
  Shield,
  AlertCircle
} from 'lucide-react';

interface Proposal {
  id: string;
  title: string;
  description: string;
  proposal_type: string;
  created_by: string;
  created_at: string;
  voting_deadline: string;
  required_threshold: number;
  current_yes_votes: number;
  current_no_votes: number;
  status: 'Active' | 'Passed' | 'Rejected' | 'Expired' | 'Executed';
  votes: Record<string, Vote>;
  treasury_auto_vote: boolean;
}

interface Vote {
  voter_address: string;
  vote_type: 'Yes' | 'No' | 'Abstain';
  voting_power: number;
  biusd_staked: number;
  voted_at: string;
}

interface GovernanceMember {
  wallet_address: string;
  voting_percentage: number;
  added_by_founder: boolean;
  added_at: string;
  is_active: boolean;
}

interface GovernanceStats {
  enabled: boolean;
  total_members: number;
  active_proposals: number;
  total_proposals: number;
  founder_voting_power: number;
  treasury_voting_power: number;
}

const GovernancePanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [governanceEnabled, setGovernanceEnabled] = useState(false);
  const [stats, setStats] = useState<GovernanceStats | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [members] = useState<GovernanceMember[]>([]);
  const [loading, setLoading] = useState(false);

  // Form states
  const [newProposal, setNewProposal] = useState({
    title: '',
    description: '',
    proposal_type: 'general_changes',
    duration_days: 7
  });

  const [newMember, setNewMember] = useState({
    wallet_address: '',
    voting_percentage: 5.0
  });

  const founderAddress = "DIS1FOUNDER00000000000000000000000000";

  useEffect(() => {
    loadGovernanceData();
  }, []);

  const loadGovernanceData = async () => {
    setLoading(true);
    try {
      // Load governance statistics
      const statsResponse = await fetch('/api/v1/governance/stats');
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData.data);
        setGovernanceEnabled(statsData.data.enabled);
      }

      // Load proposals
      const proposalsResponse = await fetch('/api/v1/governance/proposals');
      if (proposalsResponse.ok) {
        const proposalsData = await proposalsResponse.json();
        setProposals(proposalsData.data.proposals || []);
      }
    } catch (error) {
      console.error('Error loading governance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleGovernance = async () => {
    try {
      const response = await fetch('/api/v1/governance/enable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enabled: !governanceEnabled,
          caller_address: founderAddress
        })
      });

      if (response.ok) {
        setGovernanceEnabled(!governanceEnabled);
        loadGovernanceData();
      }
    } catch (error) {
      console.error('Error toggling governance:', error);
    }
  };

  const createProposal = async () => {
    try {
      const response = await fetch('/api/v1/governance/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newProposal,
          caller_address: founderAddress
        })
      });

      if (response.ok) {
        setNewProposal({
          title: '',
          description: '',
          proposal_type: 'general_changes',
          duration_days: 7
        });
        loadGovernanceData();
      }
    } catch (error) {
      console.error('Error creating proposal:', error);
    }
  };

  const addGovernanceMember = async () => {
    try {
      const response = await fetch('/api/v1/governance/members/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newMember,
          caller_address: founderAddress
        })
      });

      if (response.ok) {
        setNewMember({
          wallet_address: '',
          voting_percentage: 5.0
        });
        loadGovernanceData();
      }
    } catch (error) {
      console.error('Error adding member:', error);
    }
  };

  const voteOnProposal = async (proposalId: string, voteType: 'yes' | 'no' | 'abstain', stakingAmount: number) => {
    try {
      const response = await fetch('/api/v1/governance/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proposal_id: proposalId,
          vote_type: voteType,
          biusd_staked: stakingAmount,
          voter_address: founderAddress
        })
      });

      if (response.ok) {
        loadGovernanceData();
      }
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-blue-600 bg-blue-100';
      case 'Passed': return 'text-green-600 bg-green-100';
      case 'Rejected': return 'text-red-600 bg-red-100';
      case 'Expired': return 'text-gray-600 bg-gray-100';
      case 'Executed': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getProposalTypeDisplay = (type: string) => {
    switch (type) {
      case 'critical_infrastructure': return '🔧 Critical Infrastructure';
      case 'staking_changes': return '💰 Staking Changes';
      case 'general_changes': return '⚙️ General Changes';
      case 'major_changes': return '🚀 Major Changes';
      default: return '📋 Other';
    }
  };

  const getThresholdDisplay = (type: string) => {
    switch (type) {
      case 'critical_infrastructure': return '51%';
      case 'staking_changes': return '80%';
      case 'general_changes': return '60%';
      case 'major_changes': return '70%';
      default: return '60%';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Shield className="h-8 w-8 text-blue-600" />
            Governance Control Panel
          </h1>
          <p className="text-gray-600 mt-2">Founder Dashboard - Manage system governance and voting</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Governance Status:</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              governanceEnabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {governanceEnabled ? 'Enabled' : 'Disabled'}
            </span>
          </div>
          
          <button
            onClick={toggleGovernance}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              governanceEnabled 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {governanceEnabled ? 'Disable Governance' : 'Enable Governance'}
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Members</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total_members}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3">
              <Vote className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Active Proposals</p>
                <p className="text-2xl font-bold text-gray-900">{stats.active_proposals}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Founder Power</p>
                <p className="text-2xl font-bold text-gray-900">{stats.founder_voting_power}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Treasury Power</p>
                <p className="text-2xl font-bold text-gray-900">{stats.treasury_voting_power}%</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', name: 'Overview', icon: Shield },
            { id: 'proposals', name: 'Proposals', icon: Vote },
            { id: 'members', name: 'Members', icon: Users },
            { id: 'settings', name: 'Settings', icon: Settings }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Governance Rules</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Voting Thresholds</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Critical Infrastructure:</span>
                    <span className="font-medium">51%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Staking Changes:</span>
                    <span className="font-medium">80%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">General Changes:</span>
                    <span className="font-medium">60%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Major Changes:</span>
                    <span className="font-medium">70%</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Voting Power</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Founder Wallet:</span>
                    <span className="font-medium text-blue-600">50%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Treasury Wallet:</span>
                    <span className="font-medium text-green-600">1%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Combined Control:</span>
                    <span className="font-medium text-purple-600">51%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Min. Stake Required:</span>
                    <span className="font-medium">1 BiUSD</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'proposals' && (
        <div className="space-y-6">
          {/* Create New Proposal */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Create New Proposal
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={newProposal.title}
                  onChange={(e) => setNewProposal({...newProposal, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter proposal title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={newProposal.proposal_type}
                  onChange={(e) => setNewProposal({...newProposal, proposal_type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="general_changes">General Changes (60%)</option>
                  <option value="major_changes">Major Changes (70%)</option>
                  <option value="staking_changes">Staking Changes (80%)</option>
                  <option value="critical_infrastructure">Critical Infrastructure (51%)</option>
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newProposal.description}
                  onChange={(e) => setNewProposal({...newProposal, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe the proposal in detail"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration (Days)</label>
                <input
                  type="number"
                  value={newProposal.duration_days}
                  onChange={(e) => setNewProposal({...newProposal, duration_days: parseInt(e.target.value)})}
                  min="1"
                  max="30"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex items-end">
                <button
                  onClick={createProposal}
                  disabled={!newProposal.title || !newProposal.description}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors"
                >
                  Create Proposal
                </button>
              </div>
            </div>
          </div>

          {/* Active Proposals */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Active Proposals</h2>
            
            {proposals.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Vote className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No proposals yet. Create the first one above!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {proposals.map((proposal) => (
                  <div key={proposal.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-medium text-gray-900">{proposal.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{proposal.description}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(proposal.status)}`}>
                        {proposal.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Type</p>
                        <p className="font-medium">{getProposalTypeDisplay(proposal.proposal_type)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Required Threshold</p>
                        <p className="font-medium">{getThresholdDisplay(proposal.proposal_type)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Voting Ends</p>
                        <p className="font-medium flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {new Date(proposal.voting_deadline).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Yes: {proposal.current_yes_votes}%</span>
                        <span>No: {proposal.current_no_votes}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-l-full" 
                          style={{width: `${proposal.current_yes_votes}%`}}
                        ></div>
                      </div>
                    </div>
                    
                    {proposal.status === 'Active' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => voteOnProposal(proposal.id, 'yes', 1000)}
                          className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                        >
                          <Check className="h-4 w-4" />
                          Vote Yes
                        </button>
                        <button
                          onClick={() => voteOnProposal(proposal.id, 'no', 1000)}
                          className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                        >
                          <X className="h-4 w-4" />
                          Vote No
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'members' && (
        <div className="space-y-6">
          {/* Add New Member */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add Governance Member
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Wallet Address</label>
                <input
                  type="text"
                  value={newMember.wallet_address}
                  onChange={(e) => setNewMember({...newMember, wallet_address: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="DIS1MEMBER00000000000000000000000000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Voting Power (%)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={newMember.voting_percentage}
                    onChange={(e) => setNewMember({...newMember, voting_percentage: parseFloat(e.target.value)})}
                    min="0.1"
                    max="49"
                    step="0.1"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={addGovernanceMember}
                    disabled={!newMember.wallet_address || newMember.voting_percentage <= 0}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Current Members */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Governance Members</h2>
            
            <div className="space-y-3">
              {/* Permanent Members */}
              <div className="border border-blue-200 bg-blue-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-blue-900">Founder Wallet (Permanent)</h3>
                    <p className="text-sm text-blue-700">DIS1FOUNDER00000000000000000000000000</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-blue-900">50%</p>
                    <p className="text-sm text-blue-700">Voting Power</p>
                  </div>
                </div>
              </div>
              
              <div className="border border-green-200 bg-green-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-green-900">Treasury Wallet (Permanent)</h3>
                    <p className="text-sm text-green-700">DIS1TREASURY000000000000000000000000</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-900">1%</p>
                    <p className="text-sm text-green-700">Auto-votes with Founder</p>
                  </div>
                </div>
              </div>
              
              {/* Custom Members */}
              {members.map((member) => (
                <div key={member.wallet_address} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">Governance Member</h3>
                      <p className="text-sm text-gray-600">{member.wallet_address}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{member.voting_percentage}%</p>
                      <p className="text-sm text-gray-600">Voting Power</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Governance Settings</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">Governance System</h3>
                  <p className="text-sm text-gray-600">Enable or disable the governance system</p>
                </div>
                <button
                  onClick={toggleGovernance}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    governanceEnabled 
                      ? 'bg-red-600 hover:bg-red-700 text-white' 
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {governanceEnabled ? 'Disable' : 'Enable'}
                </button>
              </div>
              
              <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-yellow-900">Important Notes</h3>
                    <ul className="text-sm text-yellow-800 mt-2 space-y-1">
                      <li>• Founder and Treasury wallets cannot be removed from governance</li>
                      <li>• Treasury automatically votes the same as Founder</li>
                      <li>• Combined Founder + Treasury power (51%) can pass critical infrastructure changes</li>
                      <li>• All voting requires BiUSD staking (minimum 1 BiUSD)</li>
                      <li>• Enable governance only when your company is ready for community input</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GovernancePanel; 