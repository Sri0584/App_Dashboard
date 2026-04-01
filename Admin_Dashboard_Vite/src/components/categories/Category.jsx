import { MenuItem } from "@mui/material";
import { Select } from "@mui/material";
import React from "react";
import "./category.css";

const options = [
	"electronics",
	"shoes",
	"furniture",
	"fashion",
	"gaming",
	"fitness",
];

const Category = ({ value, handleChange }) => {
	const isMultiple = Array.isArray(value);
	const normalizedValue = isMultiple ? value : (value || "");

	return (
		<Select
			onChange={handleChange}
			name='categories'
			value={normalizedValue}
			multiple={isMultiple}
			displayEmpty
			fullWidth
			renderValue={(selected) => {
				if (
					(Array.isArray(selected) && selected.length === 0) ||
					selected === ""
				) {
					return <em>Select Category</em>;
				}

				return Array.isArray(selected) ? selected.join(", ") : selected;
			}}
		>
			<MenuItem value=''>
				<em>Select Category</em>
			</MenuItem>
			{options.map((option) => (
				<MenuItem key={option} value={option}>
					{option}
				</MenuItem>
			))}
		</Select>
	);
};

export default Category;
