import React from 'react';

export default function AddressComponent({
  address = {},
  editing = false,
  onChange = () => {}
}) {
  // address: { line, city, state, pincode, country }
  if (!editing) {
    const { line, city, state, pincode, country } = address || {};
    const parts = [line, city, state, pincode, country].filter(Boolean);
    return (
      <div className="address-display">
        {parts.length === 0 ? <p className="muted">No address provided</p> : <p>{parts.join(', ')}</p>}
      </div>
    );
  }

  return (
    <div className="address-form-grid">
      <div className="form-group">
        <label>Address Line</label>
        <input
          name="addressLine"
          value={address.line || ''}
          onChange={(e) => onChange('addressLine', e.target.value)}
          placeholder="Street, Building, House no."
        />
      </div>

      <div className="form-group">
        <label>City</label>
        <input
          name="addressCity"
          value={address.city || ''}
          onChange={(e) => onChange('addressCity', e.target.value)}
          placeholder="City"
        />
      </div>

      <div className="form-group">
        <label>State</label>
        <input
          name="addressState"
          value={address.state || ''}
          onChange={(e) => onChange('addressState', e.target.value)}
          placeholder="State"
        />
      </div>

      <div className="form-group">
        <label>Pincode</label>
        <input
          name="addressPincode"
          value={address.pincode || ''}
          onChange={(e) => onChange('addressPincode', e.target.value)}
          placeholder="Pincode / ZIP"
        />
      </div>

      <div className="form-group">
        <label>Country</label>
        <input
          name="addressCountry"
          value={address.country || ''}
          onChange={(e) => onChange('addressCountry', e.target.value)}
          placeholder="Country"
        />
      </div>
    </div>
  );
}
