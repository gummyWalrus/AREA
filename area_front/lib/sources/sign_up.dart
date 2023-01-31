import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

import 'package:area_front/sources/components/theme.dart';
import 'package:area_front/sources/components/gradient_text.dart';
import 'package:area_front/sources/components/loading_screen.dart';
import 'package:area_front/sources/components/elevated_button.dart';
import 'package:area_front/sources/components/bottom_navigation.dart';

// Define a custom Form widget.
class SignUp extends StatefulWidget {
  const SignUp({super.key});

  @override
  State<SignUp> createState() => _SignUpState();
}

// Define a corresponding State class.
// This class holds data related to the form.
class _SignUpState extends State<SignUp> {
  // Create a global key that uniquely identifies the Form widget
  // and allows validation of the form.
  //
  // Note: This is a `GlobalKey<FormState>`,
  // not a GlobalKey<LoginScreenState>.
  bool _isLoading = false;
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _firstNameController = TextEditingController();
  final TextEditingController _lastNameController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  void _fetchData() async {
    setState(() {
      _isLoading = true;
    });
    final url = Uri.http('localhost:8080', 'user/register');
    final response = await http.post(url, body: {
      "email": _emailController.text,
      "firstname": _firstNameController.text,
      "lastname": _lastNameController.text,
      "password": _passwordController.text
    });
    if (response.statusCode == 201) {
      setState(() {
        final userData = json.decode(response.body);
        final String token = userData['token'];
        const snackBar = SnackBar(content: Text('Signin Up'));
        ScaffoldMessenger.of(context).showSnackBar(snackBar);
        _isLoading = false;
        Navigator.push(
            context,
            MaterialPageRoute(
                builder: (context) => BottomNavigation(
                      token: token,
                      userData: userData,
                    )));
      });
    } else {
      setState(() {
        const snackBar = SnackBar(content: Text('Failed to sign up'));
        ScaffoldMessenger.of(context).showSnackBar(snackBar);
        _isLoading = false;
      });
    }
  }

  @override
  void dispose() {
    // Clean up the controller when the widget is disposed.
    _firstNameController.dispose();
    _lastNameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return _isLoading
        ? const LoadingScreen()
        : Container(
            decoration: const BoxDecoration(gradient: themedGradient),
            child: Scaffold(
              backgroundColor: Colors.transparent,
              body: ListView(
                children: [
                  Container(
                    height: 675,
                    margin: const EdgeInsets.only(
                        top: 50.0, left: 25.0, bottom: 25.0, right: 25.0),
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(30),
                      color: Colors.white,
                    ),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                      children: [
                        Container(
                            margin: const EdgeInsets.only(top: 15.0),
                            child: const GradientText(
                              'Sign Up',
                              gradient: themedGradient,
                              style: TextStyle(
                                  fontSize: 60, fontWeight: FontWeight.bold),
                            )),
                        Form(
                          key: _formKey,
                          child: Column(
                            children: [
                              // Text field for First Name entry
                              Container(
                                margin: const EdgeInsets.all(15.0),
                                child: Column(
                                  children: [
                                    const Align(
                                        alignment: Alignment.topLeft,
                                        child: Text('First Name')),
                                    TextFormField(
                                      controller: _firstNameController,
                                      decoration: const InputDecoration(
                                          hintText: "Jean"),
                                      validator: (value) {
                                        if (value == null || value.isEmpty) {
                                          return 'Invalid fristname';
                                        }
                                        return null;
                                      },
                                    ),
                                  ],
                                ),
                              ),
                              // Text field for Lastname entry
                              Container(
                                margin: const EdgeInsets.all(15.0),
                                child: Column(
                                  children: [
                                    const Align(
                                        alignment: Alignment.topLeft,
                                        child: Text('Lastname')),
                                    TextFormField(
                                      controller: _lastNameController,
                                      decoration: const InputDecoration(
                                          hintText: "Du Jardin"),
                                      validator: (value) {
                                        if (value == null || value.isEmpty) {
                                          return 'Invalid lastname';
                                        }
                                        return null;
                                      },
                                    ),
                                  ],
                                ),
                              ),
                              // Text field for login entry
                              Container(
                                margin: const EdgeInsets.all(15.0),
                                child: Column(
                                  children: [
                                    const Align(
                                        alignment: Alignment.topLeft,
                                        child: Text('Email')),
                                    TextFormField(
                                      controller: _emailController,
                                      decoration: const InputDecoration(
                                          hintText: "exemple@email.com"),
                                      validator: (value) {
                                        if (value == null || value.isEmpty) {
                                          return 'Invalid email ID';
                                        }
                                        return null;
                                      },
                                    ),
                                  ],
                                ),
                              ),
                              // Text field for password entry
                              Container(
                                margin: const EdgeInsets.all(15.0),
                                child: Column(
                                  children: [
                                    const Align(
                                        alignment: Alignment.topLeft,
                                        child: Text('Password')),
                                    TextFormField(
                                      controller: _passwordController,
                                      obscureText: true,
                                      decoration: const InputDecoration(
                                          hintText: "éaz(e-ft0u7hi4n711l"),
                                      validator: (value) {
                                        if (value == null || value.isEmpty) {
                                          return 'Invalid password';
                                        }
                                        return null;
                                      },
                                    ),
                                  ],
                                ),
                              ),
                              // Form validation button
                              Container(
                                margin: const EdgeInsets.only(top: 30.0),
                                width: 200,
                                child: MyElevatedButton(
                                  gradient: themedGradient,
                                  borderRadius: BorderRadius.circular(30),
                                  onPressed: () {
                                    // Validate returns true if the form is valid, or false otherwise.
                                    if (_formKey.currentState!.validate()) {
                                      // If the form is valid, send post request to _url
                                      _fetchData();
                                    }
                                  },
                                  child: const Text('Submit'),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          );
  }
}
