import React, { useEffect, useRef } from "react";
import "bs-stepper/dist/css/bs-stepper.min.css";
import Stepper from "bs-stepper";

const StepperComponent = () => {
  const stepperRef = useRef(null);

  useEffect(() => {
    const stepperElement = stepperRef.current;
    const stepper = new Stepper(stepperElement, {
      linear: false,
      animation: true,
    });
    return () => {
      stepper.destroy();
    };
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    // Add your submit logic here
  };

  return (
    <div>
      <div ref={stepperRef} id="stepper1" className="bs-stepper">
        <div className="bs-stepper-header">
          <div className="step" data-target="#test-l-1">
            <button className="step-trigger">
              <span className="bs-stepper-circle">1</span>
              <span className="bs-stepper-label">Email</span>
            </button>
          </div>
          <div className="line"></div>
          <div className="step" data-target="#test-l-2">
            <button className="step-trigger">
              <span className="bs-stepper-circle">2</span>
              <span className="bs-stepper-label">Password</span>
            </button>
          </div>
          <div className="line"></div>
          <div className="step" data-target="#test-l-2">
            <button className="step-trigger">
              <span className="bs-stepper-circle">3</span>
              <span className="bs-stepper-label">Validate</span>
            </button>
          </div>
        </div>
        <div className="bs-stepper-content">
          <form onSubmit={onSubmit}>
            <div id="test-l-1" className="content"></div>
            <div id="test-l-2" className="content"></div>
            <div id="test-l-3" className="content"></div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StepperComponent;
