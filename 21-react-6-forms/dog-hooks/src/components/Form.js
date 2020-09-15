import React from 'react';
import { useForm } from 'react-hook-form'
import { MDBContainer, MDBRow, MDBCol, MDBInput, MDBBtn } from 'mdbreact'

const Form = () => {
    const { register, handleSubmit, errors } = useForm(); // initialize the hook
    const onSubmit = (data) => {
      console.log(data);
    };
  
    return (
    //   <form onSubmit={handleSubmit(onSubmit)}>
    //     <input name="firstname" ref={register} /> {/* register an input */}
        
    //     <input name="lastname" ref={register({ required: true })} />
    //     {errors.lastname && 'Last name is required.'}
        
    //     <input name="age" ref={register({ pattern: /\d+/ })} />
    //     {errors.age && 'Please enter number for age.'}
        
    //     <input type="submit" />
    //   </form>
    <MDBContainer>
      <MDBRow>
        <MDBCol md='6' className='offset-md-3'>
          <h1 className='text-center'>Login</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='grey-text'>
              <MDBInput
                label='Email Address'
                icon='envelope'  
                type='email'
                ref={register({ name: 'email' })} 
              />
              <input name="email" ref={register({ required: true })} />
              {errors.email && 'Last name is required.'}
              <MDBInput label='Password' icon='lock' group type='password' />
            </div>
            <div className='text-center'>
              <MDBBtn color='primary' type='submit'>Login</MDBBtn>
            </div>
          </form>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
    );
}

export default Form