/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
// import DropzoneExample from 'containers/forms/DropzoneExample';
import { Formik, Form, Field } from 'formik';
import ReactQuill from 'react-quill';
import { FormGroup, Label, Button, Row } from 'reactstrap';
// import DatePicker from 'react-datepicker';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-quill/dist/quill.snow.css';
import Select from 'react-select';
import { makeStyles } from '@mui/styles';
import { NavLink, useNavigate } from 'react-router-dom';
import { addOffer } from 'redux/actions';
import { useDispatch } from 'react-redux';
import CustomSelectInput from 'components/common/CustomSelectInput';
import API from 'helpers/API';
import UploadSingleImage from '../ui/components/UploadSingleImage';

const useStyles = makeStyles(() => ({
  cancel: {
    border: '1px solid #6c757d',
    background: 'none',
    color: '#6c757d',
    padding: '0.5rem 1.25rem 0.5rem 1.25rem',
    borderRadius: '50px',
    marginLeft: '10px',
    '&:hover': {
      background: '#6c757d',
      border: '1px solid #6c757d',
    },
  },
  image: {
    border: '1px dotted',
    display: 'flex',
    width: '30%',
    margin: ' 0 auto',
    height: '115px',
    cursor: 'pointer',
    // [theme.breakpoints.up('sm')]: {
    //   backgroundColor: 'red',
    // },
    '@media (max-width: 450px)': {
      width: '70%',
      height: '90px',
    },
  },
  upload: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    margin: 'auto',
    width: '30%',
    height: '115px',
    '@media (max-width: 450px)': {
      width: '70%',
      height: '90px',
    },
  },

  date: {
    height: '40px',
  },
}));

const quillModules = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [
      { list: 'ordered' },
      { list: 'bullet' },
      { indent: '-1' },
      { indent: '+1' },
    ],
    ['link', 'image'],
    ['clean'],
  ],
};

const quillFormats = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link',
  'image',
];

function AddOffer() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useNavigate();
  const [offerOptions, setOfferOption] = useState({});
  const [selectedApplicable, setSelectedApplicable] = useState('');
  const [activeCategory, setActiveCategory] = useState('');

  const [offer, setOffer] = useState({
    image: { file: '', url: '' },
    title: '',
    validTill: new Date(),
    discountType: {},
    value: '',
    description: '',
    discountValue: '',
    offerType: '',
    key: '',
  });

  useEffect(async () => {
    const { data } = await API.get('/offer/home');
    if (data) setOfferOption(data);
  }, []);

  useEffect(async () => {
    if (activeCategory !== '') {
      const {
        data: { subCategory },
      } = await API.get(`/category/${activeCategory}`);
      if (subCategory) {
        setOfferOption((oldVal) => {
          return {
            ...oldVal,
            subCategory: subCategory.map((elem) => {
              return {
                value: elem.name,
                label: elem.name,
              };
            }),
          };
        });
      }
    }
  }, [activeCategory]);

  const onSubmit = () => {
    dispatch(addOffer(offer, history));
  };

  const handleChange = (value, key) => {
    setOffer((oldVal) => {
      return { ...oldVal, [key]: value };
    });
  };

  const options = [
    { value: 'flat', label: 'Flat' },
    { value: 'percents', label: 'Percentage(%)', disabled: true },
  ];

  const applicableOption = [
    { value: 'brand', label: 'Brand' },
    { value: 'category', label: 'Category' },
    { value: 'products', label: 'Products' },
  ];

  const initialValues = {
    title: '',
    validTill: new Date(),
    value: '',
    description: '',
    discountType: {},
    image: {},
  };
  const validate = () => {
    const errors = {};

    if (!offer?.image?.url && !offer?.image?.file) {
      errors.image = 'Image Required';
    }
    if (!offer?.title) {
      errors.title = 'Required';
    }
    if (!offer?.discountType?.value) {
      errors.discountType = 'Required';
    }
    if (!offer?.value) {
      errors.value = 'Required';
    }
    if (!offer?.description) {
      errors.description = 'Required';
    }
    return errors;
  };

  return (
    <>
      <div>
        <Colxx xxs="12">
          <h1>Add Offers</h1>
          <Separator className="mb-5" />
          <Row>
            <Colxx xxs="12">
              <Formik
                validate={validate}
                initialValues={initialValues}
                onSubmit={onSubmit}
              >
                {({ errors, touched, handleSubmit }) => (
                  <Form
                    onSubmit={handleSubmit}
                    className="av-tooltip tooltip-label-right mt-4"
                  >
                    <Row>
                      <Colxx lg="12" xs="12" sm="6">
                        <FormGroup>
                          <Label>Image</Label>
                          {/* <DropzoneExample /> */}
                          <Colxx xxs="5" style={{ margin: '0 auto' }}>
                            <UploadSingleImage
                              image={offer?.image?.url}
                              setImage={(image) =>
                                setOffer((oldState) => {
                                  return {
                                    ...oldState,
                                    image,
                                  };
                                })
                              }
                            />
                          </Colxx>

                          {errors.image && touched.image && (
                            <div className="invalid-feedback d-block">
                              {errors.image}
                            </div>
                          )}
                        </FormGroup>
                      </Colxx>
                    </Row>

                    <Row>
                      <Colxx lg="6" xs="12" sm="6">
                        <FormGroup>
                          <Label>Title</Label>
                          <Field
                            className="form-control"
                            name="title"
                            value={offer.title}
                            onChange={(e) =>
                              handleChange(e.target.value, 'title')
                            }
                          />
                          {errors.title && touched.title && (
                            <div className="invalid-feedback d-block">
                              {errors.title}
                            </div>
                          )}
                        </FormGroup>
                      </Colxx>
                      <Colxx lg="6" xs="12" sm="6">
                        <FormGroup>
                          <Label>Valid Till</Label>
                          <div>
                            <div>
                              <DatePicker
                                selected={offer.validTill}
                                onChange={(value) =>
                                  handleChange(value, 'validTill')
                                }
                                className={classes.date}
                                placeholderText=""
                                size="small"
                                name="validTill"
                              />
                              <div>
                                <i
                                  className="simple-icon-calendar"
                                  style={{
                                    color: '#6fb327',
                                    marginRight: '5px',
                                    position: 'absolute',
                                    right: 5,
                                    top: 33,
                                    fontSize: '20px',
                                  }}
                                />
                              </div>
                            </div>
                          </div>

                          {errors.validTill && touched.validTill && (
                            <div className="invalid-feedback d-block">
                              {errors.validTill}
                            </div>
                          )}
                        </FormGroup>
                      </Colxx>
                    </Row>
                    <Row>
                      <Colxx lg="6" xs="12" sm="6">
                        <FormGroup>
                          <Label>Flat/Percentage(%)</Label>
                          <Select
                            className="react-select react-select__single-value"
                            classNamePrefix="react-select"
                            options={options}
                            name="discountType"
                            // isMulti={isMulti}
                            // onChange={handleChangeselect}
                            onChange={({ value }) => {
                              handleChange(value, 'discountType');
                            }}
                            // onBlur={handleBlur}
                          />
                          {errors.discountType && touched.discountType ? (
                            <div className="invalid-feedback d-block">
                              {errors.discountType}
                            </div>
                          ) : null}
                        </FormGroup>
                      </Colxx>
                      <Colxx lg="6" xs="12" sm="6">
                        <FormGroup>
                          <Label>Value</Label>
                          <Field
                            className="form-control"
                            value={offer.discountValue}
                            onChange={(e) =>
                              handleChange(e.target.value, 'discountValue')
                            }
                            onKeyPress={(event) => {
                              const charCode = event.which
                                ? event.which
                                : event.keyCode;
                              if (
                                String.fromCharCode(charCode).match(/[^0-9.]/g)
                              ) {
                                event.preventDefault();
                              }
                            }}
                            name="value"
                          />

                          {errors.value && touched.value && (
                            <div className="invalid-feedback d-block">
                              {errors.value}
                            </div>
                          )}
                        </FormGroup>
                      </Colxx>
                      <Colxx lg="6" xs="12" sm="6">
                        <FormGroup>
                          <Label>Applicable To</Label>
                          <Select
                            className="react-select react-select__single-value"
                            classNamePrefix="react-select"
                            options={applicableOption}
                            name="offerType"
                            // isMulti={isMulti}
                            // onChange={handleChangeselect}
                            onChange={({ value }) => {
                              handleChange(value, 'offerType');
                              setSelectedApplicable(value);
                            }}
                            // onBlur={handleBlur}
                          />
                          {errors.discountType && touched.discountType ? (
                            <div className="invalid-feedback d-block">
                              {errors.discountType}
                            </div>
                          ) : null}
                        </FormGroup>
                      </Colxx>
                      {selectedApplicable === 'brand' && (
                        <Colxx lg="6" xs="12" sm="6">
                          <FormGroup>
                            <Label>Brand</Label>
                            <Select
                              className="react-select react-select__single-value"
                              classNamePrefix="react-select"
                              options={offerOptions.brand}
                              name="discountType"
                              // isMulti={isMulti}
                              // onChange={handleChangeselect}
                              onChange={({ value }) => {
                                handleChange('brand', 'key');
                                handleChange(value, 'value');
                              }}
                              // onBlur={handleBlur}
                            />
                            {errors.discountType && touched.discountType ? (
                              <div className="invalid-feedback d-block">
                                {errors.discountType}
                              </div>
                            ) : null}
                          </FormGroup>
                        </Colxx>
                      )}

                      {selectedApplicable === 'category' && (
                        <>
                          <Colxx lg="6" xs="12" sm="6">
                            <FormGroup>
                              <Label>Category</Label>
                              <Select
                                className="react-select react-select__single-value"
                                classNamePrefix="react-select"
                                options={offerOptions.category}
                                name="discountType"
                                // isMulti={isMulti}
                                // onChange={handleChangeselect}
                                onChange={({ value, label }) => {
                                  handleChange('category', 'key');
                                  handleChange(label, 'value');
                                  setActiveCategory(value);
                                }}
                                // onBlur={handleBlur}
                              />
                              {errors.discountType && touched.discountType ? (
                                <div className="invalid-feedback d-block">
                                  {errors.discountType}
                                </div>
                              ) : null}
                            </FormGroup>
                          </Colxx>
                          <Colxx lg="6" xs="12" sm="6">
                            <FormGroup>
                              <Label>Sub Category</Label>
                              <Select
                                className="react-select react-select__single-value"
                                classNamePrefix="react-select"
                                options={offerOptions.subCategory}
                                name="discountType"
                                // isMulti={isMulti}
                                // onChange={handleChangeselect}
                                onChange={({ value, label }) => {
                                  handleChange('subCategory', 'key');
                                  handleChange(label, 'value');
                                  setActiveCategory(value);
                                }}
                                // onBlur={handleBlur}
                              />
                              {errors.discountType && touched.discountType ? (
                                <div className="invalid-feedback d-block">
                                  {errors.discountType}
                                </div>
                              ) : null}
                            </FormGroup>
                          </Colxx>
                        </>
                      )}

                      {selectedApplicable === 'products' && (
                        <Colxx lg="6" xs="12" sm="6">
                          <FormGroup>
                            <Label>Products</Label>
                            <Select
                              isMulti
                              components={{ Input: CustomSelectInput }}
                              className="react-select react-select__single-value"
                              classNamePrefix="react-select"
                              options={offerOptions.products}
                              name="discountType"
                              // isMulti={isMulti}
                              // onChange={handleChangeselect}
                              onChange={(value) => {
                                handleChange('products', 'key');
                                handleChange(value, 'value');
                              }}
                              // onBlur={handleBlur}
                            />
                            {errors.discountType && touched.discountType ? (
                              <div className="invalid-feedback d-block">
                                {errors.discountType}
                              </div>
                            ) : null}
                          </FormGroup>
                        </Colxx>
                      )}
                    </Row>

                    <Row>
                      <Colxx lg="12" xs="6" sm="6">
                        <Label>Description</Label>
                        <ReactQuill
                          theme="snow"
                          name="description"
                          value={offer.description || ''}
                          onChange={(value) =>
                            handleChange(value, 'description')
                          }
                          modules={quillModules}
                          formats={quillFormats}
                          style={{ marginBottom: '10px' }}
                        />
                        {errors.description && touched.description && (
                          <div className="invalid-feedback d-block">
                            {errors.description}
                          </div>
                        )}
                      </Colxx>
                    </Row>
                    <div
                      style={{
                        textAlign: 'end',
                        margin: '15px 0px 15px 0px',
                      }}
                    >
                      <Button color="primary" type="submit">
                        Submit
                      </Button>

                      <NavLink to="./Offers">
                        <Button
                          outline
                          className={classes.cancel}
                          // style={{ background: '#6c757d', border: 'none' }}
                        >
                          Cancel
                        </Button>
                      </NavLink>
                    </div>
                  </Form>
                )}
              </Formik>
            </Colxx>
          </Row>
        </Colxx>
      </div>
    </>
  );
}

export default AddOffer;
