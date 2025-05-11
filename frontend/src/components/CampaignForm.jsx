import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, MenuItem, Select, InputLabel, FormControl, Paper, IconButton, Card, CardContent, Stack } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const fields = [
  { value: 'totalSpend', label: 'Total Spend' },
  { value: 'visits', label: 'Visits' },
];
const operators = [
  { value: '>', label: '>' },
  { value: '<', label: '<' },
  { value: '>=', label: '>=' },
  { value: '<=', label: '<=' },
  { value: '==', label: '==' },
  { value: '!=', label: '!=' },
];

function defaultCondition() {
  return { field: 'totalSpend', operator: '>', value: '' };
}
function defaultGroup() {
  return { logic: 'AND', conditions: [defaultCondition()] };
}

function RuleGroup({ group, onChange, onRemove, isRoot = false }) {
  // group: { logic: 'AND'|'OR', conditions: [condition|group] }
  const handleLogicChange = (val) => {
    onChange({ ...group, logic: val });
  };
  const handleConditionChange = (idx, key, val) => {
    const newConds = group.conditions.map((c, i) =>
      i === idx ? { ...c, [key]: val } : c
    );
    onChange({ ...group, conditions: newConds });
  };
  const handleAddCondition = () => {
    onChange({ ...group, conditions: [...group.conditions, defaultCondition()] });
  };
  const handleRemoveCondition = (idx) => {
    onChange({ ...group, conditions: group.conditions.filter((_, i) => i !== idx) });
  };
  const handleAddGroup = () => {
    onChange({ ...group, conditions: [...group.conditions, defaultGroup()] });
  };
  const handleGroupChange = (idx, newGroup) => {
    onChange({ ...group, conditions: group.conditions.map((c, i) => i === idx ? newGroup : c) });
  };
  const handleRemoveGroup = (idx) => {
    onChange({ ...group, conditions: group.conditions.filter((_, i) => i !== idx) });
  };
  return (
    <Card variant={isRoot ? 'outlined' : 'elevation'} sx={{ mb: 2, ml: isRoot ? 0 : 3, background: isRoot ? '#f5f7fa' : '#fff' }}>
      <CardContent>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <FormControl sx={{ minWidth: 100 }} size="small">
            <InputLabel>Logic</InputLabel>
            <Select value={group.logic} label="Logic" onChange={e => handleLogicChange(e.target.value)}>
              <MenuItem value="AND">AND</MenuItem>
              <MenuItem value="OR">OR</MenuItem>
            </Select>
          </FormControl>
          {!isRoot && (
            <Button color="error" onClick={onRemove} size="small" startIcon={<DeleteIcon />}>Remove Group</Button>
          )}
        </Stack>
        {group.conditions.map((cond, idx) =>
          cond.conditions ? (
            <RuleGroup
              key={idx}
              group={cond}
              onChange={newGroup => handleGroupChange(idx, newGroup)}
              onRemove={() => handleRemoveGroup(idx)}
            />
          ) : (
            <Box key={idx} sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 1 }}>
              <FormControl sx={{ minWidth: 120 }} size="small">
                <InputLabel>Field</InputLabel>
                <Select value={cond.field} label="Field" onChange={e => handleConditionChange(idx, 'field', e.target.value)}>
                  {fields.map(f => <MenuItem key={f.value} value={f.value}>{f.label}</MenuItem>)}
                </Select>
              </FormControl>
              <FormControl sx={{ minWidth: 80 }} size="small">
                <InputLabel>Operator</InputLabel>
                <Select value={cond.operator} label="Operator" onChange={e => handleConditionChange(idx, 'operator', e.target.value)}>
                  {operators.map(o => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
                </Select>
              </FormControl>
              <TextField label="Value" type="number" value={cond.value} onChange={e => handleConditionChange(idx, 'value', e.target.value)} size="small" required sx={{ maxWidth: 100 }} />
              {group.conditions.length > 1 && (
                <IconButton onClick={() => handleRemoveCondition(idx)} color="error"><DeleteIcon /></IconButton>
              )}
            </Box>
          )
        )}
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Button onClick={handleAddCondition} variant="outlined" size="small" startIcon={<AddCircleOutlineIcon />}>Add Condition</Button>
          <Button onClick={handleAddGroup} variant="outlined" size="small" startIcon={<AddCircleOutlineIcon />}>Add Group</Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function CampaignForm({ onCreated, editData }) {
  const [name, setName] = useState(editData?.name || '');
  const [rules, setRules] = useState(editData?.rules || []);
  const [audience, setAudience] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editData) {
      setName(editData.name || '');
      if (editData.rules) {
        if (Array.isArray(editData.rules)) {
          setRules(editData.rules);
        } else {
          setRules([editData.rules]);
        }
      }
    } else {
      setName('');
      setRules([defaultGroup()]);
    }
    setAudience(null);
  }, [editData]);

  // Ensure at least one rule group is always present
  useEffect(() => {
    if (!rules[0]) {
      setRules([defaultGroup()]);
    }
  }, [rules]);

  const handlePreview = async () => {
    setLoading(true);
    // Convert all values to numbers
    const cleanRules = JSON.parse(JSON.stringify(rules));
    function clean(group) {
      group.conditions = group.conditions.map(c =>
        c.conditions ? clean(c) : { ...c, value: Number(c.value) }
      );
      return group;
    }
    if (!cleanRules[0]) {
      setLoading(false);
      alert("Please add at least one rule group.");
      return;
    }
    const rulesObj = clean(cleanRules[0]);
    const res = await fetch('http://localhost:4000/api/campaigns/preview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rules: rulesObj }),
    });
    const data = await res.json();
    setAudience(data.audienceSize);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Convert all values to numbers
    const cleanRules = JSON.parse(JSON.stringify(rules));
    function clean(group) {
      group.conditions = group.conditions.map(c =>
        c.conditions ? clean(c) : { ...c, value: Number(c.value) }
      );
      return group;
    }
    if (!cleanRules[0]) {
      setLoading(false);
      alert("Please add at least one rule group.");
      return;
    }
    const rulesObj = clean(cleanRules[0]);
    const campaignData = {
      name,
      rules: rulesObj,
    };
    if (editData && editData._id) {
      await fetch(`http://localhost:4000/api/campaigns/${editData._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(campaignData),
      });
    } else {
      await fetch('http://localhost:4000/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(campaignData),
      });
    }
    setLoading(false);
    setName('');
    setAudience(null);
    setRules([defaultGroup()]);
    if (onCreated) onCreated();
  };

  return (
    <Paper sx={{ p: 3, mb: 4, maxWidth: 700 }}>
      <Typography variant="h6" mb={2}>{editData ? 'Edit Campaign' : 'Create Campaign'}</Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField label="Campaign Name" value={name} onChange={e => setName(e.target.value)} required />
        {rules[0] && <RuleGroup group={rules[0]} onChange={newGroup => setRules([newGroup])} isRoot />}
        <Button variant="outlined" onClick={handlePreview} disabled={loading}>Preview Audience</Button>
        {audience !== null && <Typography>Audience Size: <b>{audience}</b></Typography>}
        <Button type="submit" variant="contained" disabled={loading || !name}> {editData ? 'Update Campaign' : 'Create Campaign'} </Button>
      </Box>
    </Paper>
  );
} 