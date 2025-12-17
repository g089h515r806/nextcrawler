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

function WheelConfigForm({ defaultConfig = {deltaX:"",deltaY:"",}, onConfigChange }) {
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
			<FieldLabel htmlFor="deltaX">水平滚动的距离(像素)</FieldLabel>
			<Input name="deltaX" type="text" value={config.deltaX} onChange={handleConfigChange} />
		  </Field>
		  <Field>
			<FieldLabel htmlFor="deltaY">垂直滚动的距离(像素)</FieldLabel>
			<Input name="deltaY" type="text" value={config.deltaY} onChange={handleConfigChange} />
		  </Field>			  

		</FieldGroup>
	  </form>
  );
}

function LoopClickConfigForm({ defaultConfig = {selector:"",waitTime:"",}, onConfigChange }) {
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
			<FieldLabel htmlFor="subSelector">子元素选择器</FieldLabel>
			<Input name="subSelector" type="text" value={config.subSelector} onChange={handleConfigChange} />
		  </Field>		  
		  
		  <Field>
			<FieldLabel htmlFor="waitTime">点击间隔时间</FieldLabel>
			<Input name="waitTime" type="text" value={config.waitTime} onChange={handleConfigChange} />
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
  WheelConfigForm,
  LoopClickConfigForm,
  DefaultConfigForm,
}