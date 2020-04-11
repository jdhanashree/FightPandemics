import React, { useState } from "react";
import { withRouter, Link } from "react-router-dom";
import { Button } from "grommet";
import styled from "styled-components";

import Title from "../components/Typography/Title";
import { asyncGetGeoLocation } from "../utils/geolocation";
import {
  AnswerButton,
  StyledWizard,
  WizardContainer,
  WizardStep,
  WizardNav,
} from "../components/StepWizard";
import { theme } from "../constants/theme";
import TextInput from "../components/Input/TextInput";
// import SubmitButton from "../components/Button/SubmitButton";

const INITIAL_STATE = {
  answers: [],
};

const FormGroup = styled.div`
  display: flex;
  color: ${theme.colors.primary};
  flex-flow: column wrap;
`;

const FormLabel = styled.label`
  ${theme.form.label}
`;

const UserEmailField = styled(TextInput)`
  ${theme.form.input}
  border-color: ${theme.colors.primary};
  border-width: 0 0 1px 0;
  color: ${theme.colors.darkGray};
  padding: 5px 0;
  margin-top: 5px;
`;

const SubmitButton = styled(Button)`
  ${theme.form.button}
`;

const WizardProgress = styled.h5`
  font-size: ${theme.typography.size.large};
  font-weight: normal;
`;

const StepTitle = styled.h2`
  font-size: ${theme.typography.heading.two};
  margin-bottom: 50px;
`;

const Skip = styled.p`
  ${theme.typography.paragraph.skip}
`;

const Step1 = (props) => {
  const selectLocationDetection = async () => {
    try {
      const location = await asyncGetGeoLocation();
      props.update("location", location);
    } catch {
      props.update("location", "unknown");
    } finally {
      props.nextStep();
    }
  };
  const rejectLocationDetection = () => {
    props.update("location", "unknown");
    props.nextStep();
  };
  return (
    <WizardStep>
      <WizardProgress className="text-primary">
        Question {props.currentStep} / {props.totalSteps}
      </WizardProgress>
      <StepTitle className="mb-5">Where are you located?</StepTitle>
      <AnswerButton onSelect={selectLocationDetection}>
        Detect my location
      </AnswerButton>
      <AnswerButton onSelect={rejectLocationDetection}>
        Doesn't matter
      </AnswerButton>
    </WizardStep>
  );
};

const Step2 = (props) => {
  const onSelectAnswer = () => {
    props.update("noMedicalProviderUnderstood", true);
    props.nextStep();
  };
  return (
    <WizardStep>
      <WizardProgress className="text-primary">
        Question {props.currentStep} / {props.totalSteps}
      </WizardProgress>
      <StepTitle style={{ marginBottom: "20px" }}>
        We are not a provider of healthcare services.
      </StepTitle>
      <p>
        This service is provided in good faith as a last resort for those who
        are otherwise unable to obtain help and resource during the
        unprecedented public health emergency.
      </p>
      <h4>
        <strong>Please consult a medical professional for advice.</strong>
      </h4>
      <AnswerButton onSelect={() => onSelectAnswer()}>
        I Understand.
      </AnswerButton>
    </WizardStep>
  );
};

const Step3 = (props) => {
  const onSelectAnswer = (answer) => {
    props.update("helpTypeOffered", answer);
    props.nextStep();
  };
  return (
    <WizardStep>
      <WizardProgress className="text-primary">
        Question {props.currentStep} / {props.totalSteps}
      </WizardProgress>
      <StepTitle>How do you want to contribute?</StepTitle>
      <AnswerButton onSelect={() => onSelectAnswer("volunteer")}>
        As a volunteer
      </AnswerButton>
      <AnswerButton onSelect={() => onSelectAnswer("doctor investor")}>
        As a Doctor / Investor
      </AnswerButton>
      <AnswerButton onSelect={() => onSelectAnswer("organisation")}>
        As a Organisation
      </AnswerButton>
    </WizardStep>
  );
};

const Step4 = (props) => {
  const [email, setEmail] = useState("");
  const onChange = (evt) => setEmail(evt.target.value);
  const onSubmit = () => {
    props.update("email", email);
  };
  return (
    <WizardStep>
      <WizardProgress className="text-primary">
        Question {props.currentStep} / {props.totalSteps}
      </WizardProgress>
      <StepTitle>What is your email address?</StepTitle>
      <div style={{ marginRight: "50px", marginBottom: "20px" }}>
        <FormGroup controlId="userEmailGroup">
          <FormLabel>Email</FormLabel>
          <UserEmailField
            type="email"
            name="userEmail"
            placeholder="Type your email"
            onChange={onChange}
            value={email}
          />
        </FormGroup>
        <SubmitButton fill primary label="Submit" onClick={onSubmit} />
        <Skip>
          <Link to="/AirTableCOVID">
            {/* By clicking on “skip”, users can skip the landing questions to see the information directly */}
            Skip
          </Link>
        </Skip>
      </div>
    </WizardStep>
  );
};

export const OfferHelp = withRouter((props) => {
  const [state, setState] = useState(INITIAL_STATE);
  const updateAnswers = (key, value) => {
    const { answers } = state;
    const updatedAnswers = { ...answers, [key]: value };
    setState({ ...state, updatedAnswers });
    if (key === "email") {
      localStorage.setItem("offerHelpAnswers", JSON.stringify(updatedAnswers));
      props.history.push({
        pathname: "/medical",
      });
    }
  };
  return (
    <WizardContainer className="wizard-container">
      <StyledWizard isHashEnabled nav={<WizardNav />}>
        <Step1 hashKey={"Step1"} update={updateAnswers} />
        <Step2 hashKey={"Step2"} update={updateAnswers} />
        <Step3 hashKey={"Step3"} update={updateAnswers} />
        <Step4 hashKey={"Step3"} update={updateAnswers} />
      </StyledWizard>
    </WizardContainer>
  );
});
