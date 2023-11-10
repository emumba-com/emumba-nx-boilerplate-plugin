import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Form from "../../components/form";
import Input from "../../components/input";

// interface for form
interface EmailInterface {
  email: string;
  password: string;
}

// Yup schema
const schema = Yup.object().shape({
  email: Yup.string().email().required(),
  password: Yup.string().min(8).required(),
});

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "all",
    defaultValues: { email: "", password: "" },
    resolver: yupResolver(schema), // add the resolver here
  });

  const onSubmit = (data: EmailInterface) => alert(JSON.stringify(data));
  return (
    <div style={{ width: "400px", margin: "0 auto", padding: "20px" }}>
      <Form
        register={register}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        className="change-form"
      >
        <h1 style={{ textAlign: "center", color: "#333" }}>Login</h1>
        <Input
          name="email"
          type="email"
          placeholder="Enter your email"
          error={errors.email?.message}
          autoFocus
          style={{ width: "100%", margin: "10px 0", padding: "5px" }}
        />
        <Input
          name="password"
          type="password"
          placeholder="Password"
          error={errors.password?.message}
          style={{ width: "100%", margin: "10px 0", padding: "5px" }}
        />
        <button
          className="btn btn--brand"
          style={{
            width: "100%",
            margin: "10px 0",
            padding: "10px",
            backgroundColor: "#333",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Submit
        </button>
      </Form>
    </div>
  );
};

export default Login;
