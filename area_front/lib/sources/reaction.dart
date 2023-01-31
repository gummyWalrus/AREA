import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:cached_network_image/cached_network_image.dart';

import 'package:area_front/sources/components/data.dart';
import 'package:area_front/sources/selected_service.dart';
import 'package:area_front/sources/components/theme.dart';
import 'package:area_front/sources/components/gradient_text.dart';
import 'package:area_front/sources/components/loading_screen.dart';
import 'package:area_front/sources/components/elevated_button.dart';
import 'dart:io' show Platform;
import 'package:flutter/foundation.dart' show kIsWeb;

class Reaction extends StatefulWidget {
  const Reaction(
      {required this.areaName,
      required this.areaDescription,
      required this.userData,
      required this.token,
      required this.scheme,
      super.key});

  final String token, areaName, areaDescription;
  final Map<String, dynamic> scheme;
  final Map<dynamic, dynamic> userData;

  @override
  State<Reaction> createState() => _ReactionState();
}

class _ReactionState extends State<Reaction> {
  final List<ReactionData> _response = List<ReactionData>.empty(growable: true);
  Map<dynamic, dynamic> userData = {};
  bool _isLoading = true;

  Future<List<ReactionData>> _fetchData() async {
    final url = Uri.http(
        kIsWeb ? 'localhost:8080' : '10.0.2.2:8080',
        '/services/reactions');
    final response =
        await http.get(url, headers: <String, String>{'token': widget.token});
    print('Reaction : ${response.body}');
    if (response.statusCode == 200) {
      setState(() => _isLoading = false);
      final jsonData = json.decode(response.body);
      final dataList = List<ReactionData>.empty(growable: true);
      for (final value in jsonData) {
        dataList.add(ReactionData.fromJson(value));
      }
      return dataList;
    } else {
      setState(() {
        const snackBar = SnackBar(content: Text('No service available'));
        ScaffoldMessenger.of(context).showSnackBar(snackBar);
        _isLoading = false;
      });
      return [];
    }
  }

  @override
  void initState() {
    super.initState();
    userData = widget.userData;
    _fetchData().then((value) {
      _response.addAll(value);
    });
  }

  @override
  Widget build(BuildContext context) {
    return _isLoading
        ? const LoadingScreen()
        : Scaffold(
            resizeToAvoidBottomInset: false,
            appBar: AppBar(
              backgroundColor: Colors.white,
              centerTitle: true,
              shadowColor: Theme.of(context).colorScheme.shadow,
              title: const GradientText(
                'Choose your service for reactions',
                gradient: themedGradient,
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 24),
              ),
            ),
            backgroundColor: Colors.transparent,
            body: Container(
              decoration: const BoxDecoration(gradient: themedGradient),
              child: ListView(
                children: <Widget>[
                  GridView.builder(
                    gridDelegate:
                        const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 2,
                      crossAxisSpacing: 5.0,
                      mainAxisSpacing: 5.0,
                    ),
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: _response.length,
                    itemBuilder: (context, index) {
                      return Container(
                          margin: const EdgeInsets.all(15.0),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(30),
                          ),
                          child: MyElevatedButton(
                            onPressed: () {
                              Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                      builder: (context) => SelectedService(
                                            areaName: widget.areaName,
                                            areaDescription:
                                                widget.areaDescription,
                                            userData: userData,
                                            token: widget.token,
                                            name: _response[index].name,
                                            id: _response[index].id,
                                            logo: _response[index].logo,
                                            scheme: widget.scheme,
                                            type: 'reactions',
                                          )));
                            },
                            child: Image(
                                image: CachedNetworkImageProvider(
                                    _response[index].logo)),
                          ));
                    },
                  ),
                ],
              ),
            ),
          );
  }
}
