import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { baseURL } from '../App';

function ContactUsTickets() {
  const [tickets, setTickets] = useState([]);
  const [expandedIssues, setExpandedIssues] = useState({});

  useEffect(() => {
    async function fetchTickets() {
      try {
        const res = await fetch(`${baseURL}/api/survey/getAllForms`);
        const result = await res.json();

        if (result.success) {
          setTickets(result.data);
        } else {
          toast.error('Failed to retrieve tickets.');
        }
      } catch (err) {
        console.error(err);
        toast.error('Server Error. Please try again.');
      }
    }

    fetchTickets();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-8 flex items-center">
            <span className="bg-blue-600 text-white p-2 rounded-lg mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </span>
            Contact Us Tickets
          </h1>

          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Mobile</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Issue</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Created At</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {tickets.length > 0 ? (
                  tickets.map((ticket) => (
                    <Ticket key={ticket._id} ticket={ticket} />
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <p className="text-lg font-medium">No tickets found</p>
                        <p className="text-sm">New tickets will appear here</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function Ticket({ticket}) {
  const [expandIssue, setExpandIssue] = useState(false);

  async function deleteTicket() {
    let data = await fetch(`${baseURL}/api/survey/deleteTicket`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({id: ticket._id})
    });

    if(data.ok) {
      toast.success("Ticket deleted successfully");
      location.reload(true);
    } else {
      toast.error("Failed to delete ticket");
    }
  }

  return (
    <tr className="hover:bg-gray-50 transition-colors duration-200">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="h-10 w-10 flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 font-semibold text-lg">
                {ticket.name.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{ticket.name}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{ticket.email}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{ticket.mobile || 'N/A'}</div>
      </td>
      <td className="px-6 py-4">
        <div className="max-w-xs">
          <div
            className={`cursor-pointer transition-all duration-200 ${
              !expandIssue ? "truncate" : "bg-gray-50 p-3 rounded-lg"
            }`}
            onClick={() => setExpandIssue(!expandIssue)}
          >
            {expandIssue ? (
              <div className="text-sm text-gray-700 space-y-2">
                {ticket.issue.split('\n').map((line, index) => (
                  <p key={index} className="whitespace-pre-wrap">{line}</p>
                ))}
              </div>
            ) : (
              <span className="text-sm text-gray-700">
                {ticket.issue.length > 50 ? `${ticket.issue.substring(0, 50)}...` : ticket.issue}
              </span>
            )}
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {new Date(ticket.createdAt).toLocaleString()}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <button
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
          onClick={(e) => {
            e.preventDefault();
            deleteTicket();
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Delete
        </button>
      </td>
    </tr>
  );
}

export default ContactUsTickets;