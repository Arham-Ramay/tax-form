import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import apiData from "../api/apiData";

const initialValues = {
  name: "",
  percentage: "",
  applicable_items: [],
  applied_to: "some",
};

const FormTax = () => {
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    // Set the initial state with the API data
    setItems(apiData);
  }, []);

  const handleApplyToAll = (applyTo) => {
    let allItemIds = [];
    if (applyTo === "all") {
      allItemIds = items.map((item) => item.id);
    }
    setSelectedItems(allItemIds);
  };

  const handleCategoryToggle = (categoryId, checked) => {
    const updatedItems = items.map((item) => {
      if (item.category && item.category.id === categoryId) {
        return { ...item, checked };
      }
      return item;
    });
    setItems(updatedItems);
  };

  const handleItemToggle = (itemId, checked) => {
    if (checked) {
      setSelectedItems((prevItems) => [...prevItems, itemId]);
    } else {
      setSelectedItems((prevItems) => prevItems.filter((id) => id !== itemId));
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        // Update applicable_items with selectedItems
        const updatedValues = {
          ...values,
          applicable_items: selectedItems,
        };

        // Convert percentage to a decimal before logging
        const percentageDecimal = parseFloat(values.percentage) / 100;

        // Update the values object with the converted percentage
        updatedValues.percentage = percentageDecimal;

        // Handle form submission
        handleApplyToAll(
          updatedValues.applicable_items,
          updatedValues.applied_to
        );
        console.log("Submitted Data:", updatedValues);
        setSubmitting(false);
        resetForm();

        // Reset selectedItems state after form submission
        setSelectedItems([]);
      }}
    >
      {({ isSubmitting }) => (
        <div className="container mt-5 p-4">
          <Form>
            <h2 className="mb-3">Add Tax</h2>
            <div className="row mb-3">
              <div className="col">
                <Field
                  type="text"
                  name="name"
                  id="name"
                  className="form-control"
                  placeholder="Tax Name"
                />
              </div>
              <div className="col">
                <Field
                  type="text"
                  name="percentage"
                  id="percentage"
                  className="form-control"
                  placeholder="Percentage"
                />
              </div>
            </div>
            <div className="mb-3">
              <div className="form-check">
                <Field
                  type="radio"
                  name="applied_to"
                  id="all"
                  value="all"
                  className="form-check-input"
                  onClick={() => handleApplyToAll("all")}
                />
                <label htmlFor="all" className="form-check-label">
                  Apply to all items in collection
                </label>
              </div>
              <div className="form-check">
                <Field
                  type="radio"
                  name="applied_to"
                  id="specific"
                  value="specific"
                  className="form-check-input"
                />
                <label htmlFor="specific" className="form-check-label">
                  Apply to specific items
                </label>
              </div>
            </div>
            <hr />

            {items.map((item, index) => (
              <div key={index}>
                {item.category && (
                  <div style={{ backgroundColor: "#f0f0f0" }} className="mb-2">
                    <div className="form-check mb-2">
                      <Field
                        type="checkbox"
                        name={`categories.${item.category.id}`}
                        id={`category-${item.category.id}`}
                        className="form-check-input"
                        onClick={(e) =>
                          handleCategoryToggle(
                            item.category.id,
                            e.target.checked
                          )
                        }
                      />
                      <label
                        htmlFor={`category-${item.category.id}`}
                        className="form-check-label"
                      >
                        {item.category.name}
                      </label>
                    </div>
                  </div>
                )}

                <div className="form-check">
                  <Field
                    type="checkbox"
                    name={`applicable_items.${item.id}`}
                    id={`item-${item.id}`}
                    className="form-check-input"
                    onClick={(e) => handleItemToggle(item.id, e.target.checked)}
                  />
                  <label
                    htmlFor={`item-${item.id}`}
                    className="form-check-label"
                  >
                    {item.name}
                  </label>
                </div>
              </div>
            ))}
            <hr />

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                color: "white",
                backgroundColor: "orangered",
                padding: "4px 14px",
                border: "none",
                borderRadius: "6px",
              }}
            >
              Apply tax{" "}
              {selectedItems.length > 0
                ? `to ${selectedItems.length} items`
                : " "}
            </button>
          </Form>
        </div>
      )}
    </Formik>
  );
};

export default FormTax;
