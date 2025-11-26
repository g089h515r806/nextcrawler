import React, { useState } from "react";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

function WaitForConfigForm({ defaultConfig = {selector:"",timeout:"",}, onConfigChange }) {
  const [config, setConfig] = useState(defaultConfig);	

  const handleConfigChange = (e) => {
    const { name, value } = e.target;
	
	let newConfig = {
      ...config,
      [name]: value
    };
	//console.log("newItem", newItem);
    setConfig(newConfig);
	if (onConfigChange) onConfigChange(newConfig);
  };
	
  return (
	  <form>
		<FieldGroup>

		  <Field>
			<FieldLabel htmlFor="selector">选择器</FieldLabel>
			<Input name="selector" type="text" value={config.selector} onChange={handleConfigChange} />
		  </Field>
		  <Field>
			<FieldLabel htmlFor="timeout">等待时间</FieldLabel>
			<Input name="timeout" type="text" value={config.timeout} onChange={handleConfigChange} />
		  </Field>			  

		</FieldGroup>
	  </form>
  );
}

function WaitForTimeoutConfigForm({ defaultConfig = {timeout:"",}, onConfigChange }) {
  const [config, setConfig] = useState(defaultConfig);	

  const handleConfigChange = (e) => {
    const { name, value } = e.target;
	
	let newConfig = {
      ...config,
      [name]: value
    };
	//console.log("newItem", newItem);
    setConfig(newConfig);
	if (onConfigChange) onConfigChange(newConfig);
  };
	
  return (
	  <form>
		<FieldGroup>
		  <Field>
			<FieldLabel htmlFor="timeout">等待时间</FieldLabel>
			<Input name="timeout" type="text" value={config.timeout} onChange={handleConfigChange} />
		  </Field>			  

		</FieldGroup>
	  </form>
  );
}


function GotoConfigForm({defaultConfig = {url:"",}, onConfigChange }) {
	
  const [config, setConfig] = useState(defaultConfig);	

  const handleConfigChange = (e) => {
    const { name, value } = e.target;
	
	let newConfig = {
      ...config,
      [name]: value
    };
	//console.log("newItem", newItem);
    setConfig(newConfig);
	if (onConfigChange) onConfigChange(newConfig);
  };
  
  return (
	  <form>
		<FieldGroup>

		  <Field>
			<FieldLabel htmlFor="url">网址</FieldLabel>
			<Input name="url" type="text" value={config.url} onChange={handleConfigChange} />
		  </Field>

		</FieldGroup>
	  </form>
  );
}

function FillConfigForm({ defaultConfig = {selector:"", value:"",}, onConfigChange }) {
	
  const [config, setConfig] = useState(defaultConfig);	

  const handleConfigChange = (e) => {
    const { name, value } = e.target;
	
	let newConfig = {
      ...config,
      [name]: value
    };
	//console.log("newItem", newItem);
    setConfig(newConfig);
	if (onConfigChange) onConfigChange(newConfig);
  };
  
  return (
	  <form>
		<FieldGroup>

		  <Field>
			<FieldLabel htmlFor="selector">选择器</FieldLabel>
			<Input name="selector" type="text" value={config.selector} onChange={handleConfigChange}  />
		  </Field>
		  
		  <Field>
			<FieldLabel htmlFor="value">填充的值</FieldLabel>
			<Input name="value" type="text" value={config.value} onChange={handleConfigChange}  />
		  </Field>		  

		</FieldGroup>
	  </form>
  );
}


function SelectOptionConfigForm({ defaultConfig = {selector:"",value:"",}, onConfigChange }) {
  const [config, setConfig] = useState(defaultConfig);	

  const handleConfigChange = (e) => {
    const { name, value } = e.target;
	
	let newConfig = {
      ...config,
      [name]: value
    };
	//console.log("newItem", newItem);
    setConfig(newConfig);
	if (onConfigChange) onConfigChange(newConfig);
  };
	
  return (
	  <form>
		<FieldGroup>

		  <Field>
			<FieldLabel htmlFor="selector">选择器</FieldLabel>
			<Input name="selector" type="text" value={config.selector} onChange={handleConfigChange} />
		  </Field>
		  <Field>
			<FieldLabel htmlFor="value">选择的值</FieldLabel>
			<Input name="value" type="text" value={config.value} onChange={handleConfigChange} />
		  </Field>			  

		</FieldGroup>
	  </form>
  );
}

function DefaultConfigForm({ defaultConfig = {selector:"",}, onConfigChange }) {
	
  const [config, setConfig] = useState(defaultConfig);	

  const handleConfigChange = (e) => {
    const { name, value } = e.target;
	
	let newConfig = {
      ...config,
      [name]: value
    };
	//console.log("newItem", newItem);
    setConfig(newConfig);
	if (onConfigChange) onConfigChange(newConfig);
  };
  
  return (
	  <form>
		<FieldGroup>

		  <Field>
			<FieldLabel htmlFor="selector">选择器</FieldLabel>
			<Input name="selector" type="text" value={config.selector} onChange={handleConfigChange}  />
		  </Field>

		</FieldGroup>
	  </form>
  );
}

export {
  WaitForConfigForm,
  WaitForTimeoutConfigForm,
  GotoConfigForm,
  FillConfigForm,
  DefaultConfigForm,
}