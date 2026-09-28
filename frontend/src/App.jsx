import { useEffect, useState } from "react";
import "./App.css";

const API = "http://localhost:5000";

function App() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [customerLoading, setCustomerLoading] = useState(true);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [token, setToken] = useState(
    () => localStorage.getItem("crmToken") || ""
  );
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("crmUser")) || null;
    } catch {
      return null;
    }
  });
  const [loginData, setLoginData] = useState({
    email: "admin@crm.com",
    password: "Admin@123",
  });
  const [loginError, setLoginError] = useState("");

  const [customerFormData, setCustomerFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    industry: "",
    status: "Active",
    totalDeals: "",
    totalValue: "",
    assignedTo: "Aditya",
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    source: "Website",
    stage: "New",
    value: "",
    assignedTo: "Aditya",
  });

  const apiFetch = async (url, options = {}) => {
    const headers = {
      ...(options.body
        ? { "Content-Type": "application/json" }
        : {}),
      ...(options.headers || {}),
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return fetch(url, {
      ...options,
      headers,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");

    try {
      const response = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("crmToken", data.token);
      localStorage.setItem("crmUser", JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
    } catch (error) {
      setLoginError(error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("crmToken");
    localStorage.removeItem("crmUser");
    setToken("");
    setUser(null);
    setLeads([]);
    setCustomers([]);
  };

  const fetchLeads = async () =>
    try {
      const response = await apiFetch(`${API}/api/leads`);
      const data = await response.json();
      setLeads(data);
    } catch (error) {
      console.error("Failed to fetch leads:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchLeads();
      fetchCustomers();
    } else {
      setLoading(false);
      setCustomerLoading(false);
    }
  }, [token]);

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      company: "",
      source: "Website",
      stage: "New",
      value: "",
      assignedTo: "Aditya",
    });

    setEditingLead(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = editingLead
        ? `${API}/api/leads/${editingLead._id}`
        : `${API}/api/leads`;

      const method = editingLead ? "PUT" : "POST";

      const response = await apiFetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          value: Number(formData.value),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save lead");
      }

      await fetchLeads();
      resetForm();

    } catch (error) {
      console.error(error);
      alert("Failed to save lead");
    }
  };

  const handleEdit = (lead) => {
    setEditingLead(lead);

    setFormData({
      name: lead.name || "",
      email: lead.email || "",
      phone: lead.phone || "",
      company: lead.company || "",
      source: lead.source || "Website",
      stage: lead.stage || "New",
      value: lead.value || "",
      assignedTo: lead.assignedTo || "Aditya",
    });

    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this lead?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await apiFetch(`${API}/api/leads/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete lead");
      }

      await fetchLeads();

    } catch (error) {
      console.error(error);
      alert("Failed to delete lead");
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await apiFetch(`${API}/api/customers`);
      if (!response.ok) {
        throw new Error("Failed to fetch customers");
      }

      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error("Failed to fetch customers:", error);
    } finally {
      setCustomerLoading(false);
    }
  };



  const resetCustomerForm = () => {
    setCustomerFormData({
      name: "",
      email: "",
      phone: "",
      company: "",
      industry: "",
      status: "Active",
      totalDeals: "",
      totalValue: "",
      assignedTo: "Aditya",
    });

    setEditingCustomer(null);
    setShowCustomerForm(false);
  };

  const handleCustomerSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = editingCustomer
        ? `${API}/api/customers/${editingCustomer._id}`
        : `${API}/api/customers`;

      const method = editingCustomer ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...customerFormData,
          totalDeals: Number(customerFormData.totalDeals || 0),
          totalValue: Number(customerFormData.totalValue || 0),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save customer");
      }

      await fetchCustomers();
      resetCustomerForm();
    } catch (error) {
      console.error(error);
      alert("Failed to save customer");
    }
  };

  const handleCustomerEdit = (customer) => {
    setEditingCustomer(customer);

    setCustomerFormData({
      name: customer.name || "",
      email: customer.email || "",
      phone: customer.phone || "",
      company: customer.company || "",
      industry: customer.industry || "",
      status: customer.status || "Active",
      totalDeals: customer.totalDeals ?? "",
      totalValue: customer.totalValue ?? "",
      assignedTo: customer.assignedTo || "Aditya",
    });

    setShowCustomerForm(true);
  };

  const handleCustomerDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this customer?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await apiFetch(`${API}/api/customers/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete customer");
      }

      await fetchCustomers();
    } catch (error) {
      console.error(error);
      alert("Failed to delete customer");
    }
  };

  const totalValue = leads.reduce(
    (total, lead) => total + lead.value,
    0
  );

  const wonDeals = leads.filter(
    (lead) => lead.stage === "Won"
  );

  const pipelineValue = leads
    .filter((lead) => lead.stage !== "Lost")
    .reduce(
      (total, lead) => total + lead.value,
      0
    );

  const stageCount = (stage) =>
    leads.filter((lead) => lead.stage === stage).length;

  const stageValues = [
    "New",
    "Contacted",
    "Qualified",
    "Proposal",
    "Negotiation",
    "Won",
  ].map((stage) => ({
    stage,
    count: leads.filter((lead) => lead.stage === stage).length,
    value: leads
      .filter((lead) => lead.stage === stage)
      .reduce((total, lead) => total + lead.value, 0),
  }));

  const maxStageValue = Math.max(
    ...stageValues.map((item) => item.value),
    1
  );

  const conversionRate =
    leads.length > 0
      ? ((wonDeals.length / leads.length) * 100).toFixed(1)
      : "0.0";

  const averageDealValue =
    leads.length > 0
      ? Math.round(totalValue / leads.length)
      : 0;

  if (!token) {
    return (
      <div className="login-page">
        <div className="login-card">
          <div className="logo">
            <div className="logo-icon">C</div>
            <div>
              <h2>CoreCRM</h2>
              <span>Enterprise CRM</span>
            </div>
          </div>

          <h1>Sign in</h1>
          <p>Sign in to access your CRM dashboard.</p>

          <form onSubmit={handleLogin} className="login-form">
            <input
              type="email"
              placeholder="Email"
              value={loginData.email}
              onChange={(e) =>
                setLoginData({
                  ...loginData,
                  email: e.target.value,
                })
              }
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={loginData.password}
              onChange={(e) =>
                setLoginData({
                  ...loginData,
                  password: e.target.value,
                })
              }
              required
            />

            {loginError && (
              <p className="login-error">{loginError}</p>
            )}

            <button type="submit" className="save-button">
              Sign In
            </button>
          </form>

          <small>
            Demo Admin: admin@crm.com / Admin@123
          </small>
        </div>
      </div>
    );
  }

  return (
    <div className="app">

      {/* Sidebar */}
      <aside className="sidebar">

        <div className="logo">
          <div className="logo-icon">C</div>

          <div>
            <h2>CoreCRM</h2>
            <span>Enterprise CRM</span>
          </div>
        </div>

        <nav>
          <a
            className={currentPage === "dashboard" ? "active" : ""}
            onClick={() => setCurrentPage("dashboard")}
          >
            Dashboard
          </a>

          <a
            className={currentPage === "dashboard" ? "active" : ""}
            onClick={() => setCurrentPage("dashboard")}
          >
            Leads
          </a>

          <a
            className={currentPage === "customers" ? "active" : ""}
            onClick={() => setCurrentPage("customers")}
          >
            Customers
          </a>

          <a
            title="Activity API is available; activity UI is next"
            style={{ opacity: 0.6, cursor: "default" }}
          >
            Activities
          </a>
        </nav>

        <div className="sidebar-bottom">

          <a>Settings</a>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>

          <div className="profile">

            <div className="avatar">A</div>

            <div>
              <strong>{user?.name || "User"}</strong>
              <span>{user?.role || "Sales"}</span>
            </div>

          </div>

        </div>

      </aside>

      {/* Main */}
      <main className="main">

        {/* Header */}
        <header className="topbar">

          <div>
            <h1>
              {currentPage === "customers" ? "Customers" : "Dashboard"}
            </h1>

            <p>
              {currentPage === "customers"
                ? "Manage your customer relationships."
                : "Welcome back, Aditya. Here's your sales overview."}
            </p>
          </div>

          {currentPage !== "customers" && (
          <button
            className="add-button"
            onClick={() => {
              setEditingLead(null);
              setFormData({
                name: "",
                email: "",
                phone: "",
                company: "",
                source: "Website",
                stage: "New",
                value: "",
                assignedTo: "Aditya",
              });
              setShowForm(true);
            }}
          >
            + Add Lead
          </button>
          )}

        </header>

        {/* Lead Form */}
        {showForm && (
          <div className="form-card">

            <div className="section-header">

              <div>
                <h2>
                  {editingLead
                    ? "Edit Lead"
                    : "Add New Lead"}
                </h2>

                <p>
                  {editingLead
                    ? "Update lead information."
                    : "Create a new sales opportunity."}
                </p>
              </div>

              <button
                className="close-button"
                onClick={resetForm}
              >
                ×
              </button>

            </div>

            <form
              onSubmit={handleSubmit}
              className="lead-form"
            >

              <input
                type="text"
                placeholder="Lead Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value,
                  })
                }
                required
              />

              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email: e.target.value,
                  })
                }
                required
              />

              <input
                type="text"
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    phone: e.target.value,
                  })
                }
              />

              <input
                type="text"
                placeholder="Company"
                value={formData.company}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    company: e.target.value,
                  })
                }
              />

              <select
                value={formData.source}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    source: e.target.value,
                  })
                }
              >
                <option>Website</option>
                <option>Referral</option>
                <option>LinkedIn</option>
                <option>Advertisement</option>
                <option>Other</option>
              </select>

              <select
                value={formData.stage}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    stage: e.target.value,
                  })
                }
              >
                <option>New</option>
                <option>Contacted</option>
                <option>Qualified</option>
                <option>Proposal</option>
                <option>Negotiation</option>
                <option>Won</option>
                <option>Lost</option>
              </select>

              <input
                type="number"
                placeholder="Deal Value"
                value={formData.value}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    value: e.target.value,
                  })
                }
                required
              />

              <input
                type="text"
                placeholder="Assigned To"
                value={formData.assignedTo}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    assignedTo: e.target.value,
                  })
                }
              />

              <div className="form-actions">

                <button
                  type="button"
                  className="cancel-button"
                  onClick={resetForm}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-button"
                >
                  {editingLead
                    ? "Update Lead"
                    : "Create Lead"}
                </button>

              </div>

            </form>

          </div>
        )}

        {/* Stats */}
        <section
          className="stats"
          style={{ display: currentPage === "customers" ? "none" : "grid" }}
        >

          <div className="stat-card">
            <div className="stat-icon blue">L</div>

            <div>
              <span>Total Leads</span>
              <h2>{leads.length}</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">₹</div>

            <div>
              <span>Pipeline Value</span>
              <h2>
                ₹{pipelineValue.toLocaleString()}
              </h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon purple">W</div>

            <div>
              <span>Won Deals</span>
              <h2>{wonDeals.length}</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon orange">₹</div>

            <div>
              <span>Total Deal Value</span>
              <h2>
                ₹{totalValue.toLocaleString()}
              </h2>
            </div>
          </div>

        </section>

        {/* Sales Performance */}
        <section
          className="performance-card"
          style={{ display: currentPage === "customers" ? "none" : "block" }}
        >

          <div className="section-header">
            <div>
              <h2>Sales Performance</h2>
              <p>Overview of your sales activity and deal performance.</p>
            </div>
          </div>

          <div className="performance-summary">

            <div className="performance-metric">
              <span>Conversion Rate</span>
              <strong>{conversionRate}%</strong>
              <small>Leads converted to Won</small>
            </div>

            <div className="performance-metric">
              <span>Average Deal Value</span>
              <strong>₹{averageDealValue.toLocaleString()}</strong>
              <small>Average value per lead</small>
            </div>

            <div className="performance-metric">
              <span>Won Revenue</span>
              <strong>
                ₹{wonDeals
                  .reduce((total, lead) => total + lead.value, 0)
                  .toLocaleString()}
              </strong>
              <small>Total closed-won value</small>
            </div>

          </div>

          <div className="performance-chart">

            <div className="chart-header">
              <strong>Sales Value by Stage</strong>
              <span>₹{pipelineValue.toLocaleString()} pipeline</span>
            </div>

            <div className="bar-chart">

              {stageValues.map((item) => (
                <div className="bar-item" key={item.stage}>

                  <div className="bar-label">
                    <span>{item.stage}</span>
                    <strong>
                      ₹{item.value.toLocaleString()}
                    </strong>
                  </div>

                  <div className="bar-track">
                    <div
                      className="bar-fill"
                      style={{
                        width: `${(item.value / maxStageValue) * 100}%`,
                      }}
                    />
                  </div>

                  <small>
                    {item.count} lead{item.count !== 1 ? "s" : ""}
                  </small>

                </div>
              ))}

            </div>

          </div>

        </section>

        {/* Sales Pipeline */}
        <section
          className="pipeline-card"
          style={{ display: currentPage === "customers" ? "none" : "block" }}
        >

          <div className="section-header">

            <div>
              <h2>Sales Pipeline</h2>

              <p>
                Track leads through your sales process.
              </p>
            </div>

          </div>

          <div className="pipeline">

            {[
              "New",
              "Contacted",
              "Qualified",
              "Proposal",
              "Negotiation",
              "Won",
            ].map((stage) => (

              <div
                className="pipeline-column"
                key={stage}
              >

                <div className="pipeline-title">

                  <span>{stage}</span>

                  <b>
                    {stageCount(stage)}
                  </b>

                </div>

                {leads
                  .filter(
                    (lead) =>
                      lead.stage === stage
                  )
                  .map((lead) => (

                    <div
                      className="deal-card"
                      key={lead._id}
                    >

                      <h3>
                        {lead.company}
                      </h3>

                      <p>
                        {lead.name}
                      </p>

                      <strong>
                        ₹{lead.value.toLocaleString()}
                      </strong>

                      <small>
                        {lead.email}
                      </small>

                    </div>

                  ))}

              </div>

            ))}

          </div>

        </section>

        {/* Leads Table */}
        <section
          className="leads-card"
          style={{ display: currentPage === "customers" ? "none" : "block" }}
        >

          <div className="section-header">

            <div>
              <h2>Recent Leads</h2>

              <p>
                Manage your latest sales opportunities.
              </p>
            </div>

            <button className="view-button">
              View All
            </button>

          </div>

          {loading ? (

            <p className="loading">
              Loading leads...
            </p>

          ) : (

            <div className="table-wrapper">

              <table>

                <thead>

                  <tr>
                    <th>Lead</th>
                    <th>Company</th>
                    <th>Source</th>
                    <th>Stage</th>
                    <th>Value</th>
                    <th>Assigned To</th>
                    <th>Actions</th>
                  </tr>

                </thead>

                <tbody>

                  {leads.map((lead) => (

                    <tr key={lead._id}>

                      <td>

                        <div className="lead-name">

                          <div className="small-avatar">
                            {lead.name.charAt(0)}
                          </div>

                          <div>

                            <strong>
                              {lead.name}
                            </strong>

                            <span>
                              {lead.email}
                            </span>

                          </div>

                        </div>

                      </td>

                      <td>
                        {lead.company}
                      </td>

                      <td>
                        {lead.source}
                      </td>

                      <td>

                        <span
                          className={
                            "stage " +
                            lead.stage
                              .toLowerCase()
                              .replace(" ", "-")
                          }
                        >
                          {lead.stage}
                        </span>

                      </td>

                      <td>
                        ₹{lead.value.toLocaleString()}
                      </td>

                      <td>
                        {lead.assignedTo}
                      </td>

                      <td>

                        <div className="action-buttons">

                          <button
                            className="edit-button"
                            onClick={() =>
                              handleEdit(lead)
                            }
                          >
                            Edit
                          </button>

                          <button
                            className="delete-button"
                            onClick={() =>
                              handleDelete(lead._id)
                            }
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </section>

        {/* Customers Page */}
        {currentPage === "customers" && (
          <section className="leads-card">

            <div className="section-header">

              <div>
                <h2>Customers</h2>

                <p>
                  Manage your customers and customer relationships.
                </p>
              </div>

              <button
                className="add-button"
                onClick={() => {
                  setEditingCustomer(null);
                  setCustomerFormData({
                    name: "",
                    email: "",
                    phone: "",
                    company: "",
                    industry: "",
                    status: "Active",
                    totalDeals: "",
                    totalValue: "",
                    assignedTo: "Aditya",
                  });
                  setShowCustomerForm(true);
                }}
              >
                + Add Customer
              </button>

            </div>

            {showCustomerForm && (
              <div className="form-card">

                <div className="section-header">

                  <div>
                    <h2>
                      {editingCustomer
                        ? "Edit Customer"
                        : "Add New Customer"}
                    </h2>

                    <p>
                      {editingCustomer
                        ? "Update customer information."
                        : "Create a new customer record."}
                    </p>
                  </div>

                  <button
                    className="close-button"
                    onClick={resetCustomerForm}
                  >
                    ×
                  </button>

                </div>

                <form
                  onSubmit={handleCustomerSubmit}
                  className="lead-form"
                >

                  <input
                    type="text"
                    placeholder="Customer Name"
                    value={customerFormData.name}
                    onChange={(e) =>
                      setCustomerFormData({
                        ...customerFormData,
                        name: e.target.value,
                      })
                    }
                    required
                  />

                  <input
                    type="email"
                    placeholder="Email"
                    value={customerFormData.email}
                    onChange={(e) =>
                      setCustomerFormData({
                        ...customerFormData,
                        email: e.target.value,
                      })
                    }
                    required
                  />

                  <input
                    type="text"
                    placeholder="Phone"
                    value={customerFormData.phone}
                    onChange={(e) =>
                      setCustomerFormData({
                        ...customerFormData,
                        phone: e.target.value,
                      })
                    }
                  />

                  <input
                    type="text"
                    placeholder="Company"
                    value={customerFormData.company}
                    onChange={(e) =>
                      setCustomerFormData({
                        ...customerFormData,
                        company: e.target.value,
                      })
                    }
                  />

                  <input
                    type="text"
                    placeholder="Industry"
                    value={customerFormData.industry}
                    onChange={(e) =>
                      setCustomerFormData({
                        ...customerFormData,
                        industry: e.target.value,
                      })
                    }
                  />

                  <select
                    value={customerFormData.status}
                    onChange={(e) =>
                      setCustomerFormData({
                        ...customerFormData,
                        status: e.target.value,
                      })
                    }
                  >
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>

                  <input
                    type="number"
                    placeholder="Total Deals"
                    value={customerFormData.totalDeals}
                    onChange={(e) =>
                      setCustomerFormData({
                        ...customerFormData,
                        totalDeals: e.target.value,
                      })
                    }
                  />

                  <input
                    type="number"
                    placeholder="Total Value"
                    value={customerFormData.totalValue}
                    onChange={(e) =>
                      setCustomerFormData({
                        ...customerFormData,
                        totalValue: e.target.value,
                      })
                    }
                  />

                  <input
                    type="text"
                    placeholder="Assigned To"
                    value={customerFormData.assignedTo}
                    onChange={(e) =>
                      setCustomerFormData({
                        ...customerFormData,
                        assignedTo: e.target.value,
                      })
                    }
                  />

                  <div className="form-actions">

                    <button
                      type="button"
                      className="cancel-button"
                      onClick={resetCustomerForm}
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="save-button"
                    >
                      {editingCustomer
                        ? "Update Customer"
                        : "Create Customer"}
                    </button>

                  </div>

                </form>

              </div>
            )}

            {customerLoading ? (
              <p className="loading">
                Loading customers...
              </p>
            ) : customers.length === 0 ? (
              <p className="loading">
                No customers found. Click "+ Add Customer" to create one.
              </p>
            ) : (
              <div className="table-wrapper">

                <table>

                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Company</th>
                      <th>Industry</th>
                      <th>Status</th>
                      <th>Deals</th>
                      <th>Total Value</th>
                      <th>Assigned To</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>

                    {customers.map((customer) => (

                      <tr key={customer._id}>

                        <td>
                          <div className="lead-name">

                            <div className="small-avatar">
                              {customer.name.charAt(0)}
                            </div>

                            <div>
                              <strong>
                                {customer.name}
                              </strong>

                              <span>
                                {customer.email}
                              </span>
                            </div>

                          </div>
                        </td>

                        <td>
                          {customer.company || "-"}
                        </td>

                        <td>
                          {customer.industry || "-"}
                        </td>

                        <td>
                          <span
                            className={
                              "stage " +
                              customer.status.toLowerCase()
                            }
                          >
                            {customer.status}
                          </span>
                        </td>

                        <td>
                          {customer.totalDeals}
                        </td>

                        <td>
                          ₹{customer.totalValue.toLocaleString()}
                        </td>

                        <td>
                          {customer.assignedTo}
                        </td>

                        <td>

                          <div className="action-buttons">

                            <button
                              className="edit-button"
                              onClick={() =>
                                handleCustomerEdit(customer)
                              }
                            >
                              Edit
                            </button>

                            <button
                              className="delete-button"
                              onClick={() =>
                                handleCustomerDelete(customer._id)
                              }
                            >
                              Delete
                            </button>

                          </div>

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>
            )}

          </section>
        )}

      </main>

    </div>
  );
}

export default App;