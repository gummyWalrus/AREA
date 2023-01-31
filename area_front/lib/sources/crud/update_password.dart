import 'package:area_front/sources/components/theme.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

import 'package:area_front/sources/components/gradient_text.dart';
import 'package:area_front/sources/components/elevated_button.dart';
import 'dart:io' show Platform;
import 'package:flutter/foundation.dart' show kIsWeb;

// Define a custom Form widget.
class UpdatePassword extends StatefulWidget {
  const UpdatePassword({super.key});

  @override
  State<UpdatePassword> createState() => _UpdatePasswordState();
}

// Define a corresponding State class.
// This class holds data related to the form.
class _UpdatePasswordState extends State<UpdatePassword> {
  // Create a global key that uniquely identifies the Form widget
  // and allows validation of the form.
  //
  // Note: This is a `GlobalKey<FormState>`,
  // not a GlobalKey<LoginScreenState>
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final TextEditingController _confirmPasswordController =
      TextEditingController();
  Future<void> _fetchData() async {
    final url = Uri.http(
        kIsWeb ? 'localhost:8080' : '10.0.2.2:8080',
        'user/update/password');
    final response = await http.put(url, body: {
      'email': _emailController.text,
      'newPassword': _confirmPasswordController.text
    });
    if (response.statusCode == 200) {
    } else {
      setState(() {
        const snackBar = SnackBar(content: Text('Could not update password'));
        ScaffoldMessenger.of(context).showSnackBar(snackBar);
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(gradient: themedGradient),
      child: Scaffold(
        resizeToAvoidBottomInset: false,
        backgroundColor: Colors.transparent,
        body: Column(
          children: [
            Expanded(
              child: Container(
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
                          'Forgot you password ?',
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
                                    child: Text('email')),
                                TextFormField(
                                  controller: _emailController,
                                  decoration: const InputDecoration(
                                      hintText: "john.doe@email.com"),
                                  validator: (value) {
                                    if (value == null || value.isEmpty) {
                                      return 'Invalid email';
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
                                    child: Text('New password')),
                                TextFormField(
                                  controller: _passwordController,
                                  obscureText: true,
                                  decoration: const InputDecoration(
                                      hintText: "new password"),
                                  validator: (value) {
                                    if (value == null || value.isEmpty) {
                                      return 'Invalid new password';
                                    } else if (_passwordController.text !=
                                        _confirmPasswordController.text) {
                                      return 'Passwords must be the same';
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
                                    child: Text('Confirm new password')),
                                TextFormField(
                                  controller: _confirmPasswordController,
                                  obscureText: true,
                                  decoration: const InputDecoration(
                                      hintText: "confirm new password"),
                                  validator: (value) {
                                    if (value == null || value.isEmpty) {
                                      return 'Invalid new password';
                                    } else if (_confirmPasswordController
                                            .text !=
                                        _passwordController.text) {
                                      return 'Passwords must be the same';
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
            ),
          ],
        ),
      ),
    );
  }
}
