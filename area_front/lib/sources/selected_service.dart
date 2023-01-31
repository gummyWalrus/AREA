import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

import 'package:area_front/sources/data_scheme.dart';
import 'package:area_front/sources/components/data.dart';
import 'package:area_front/sources/components/theme.dart';
import 'package:area_front/sources/components/loading_screen.dart';
import 'package:area_front/sources/components/gradient_text.dart';
import 'package:area_front/sources/components/elevated_button.dart';
import 'dart:io' show Platform;
import 'package:flutter/foundation.dart' show kIsWeb;

class SelectedService extends StatefulWidget {
  const SelectedService(
      {required this.areaName,
      required this.areaDescription,
      required this.userData,
      required this.token,
      required this.name,
      required this.id,
      required this.logo,
      required this.scheme,
      required this.type,
      super.key});

  final String token, name, id, logo, type, areaName, areaDescription;
  final Map<String, dynamic> scheme;
  final Map<dynamic, dynamic> userData;

  @override
  State<SelectedService> createState() => _SelectedServiceState();
}

class _SelectedServiceState extends State<SelectedService> {
  final List<ServiceData> _response = List<ServiceData>.empty(growable: true);
  Map<dynamic, dynamic> userData = {};
  bool _isLoading = true;

  Future<List<ServiceData>> _fetchData(serviceId) async {
    final url = Uri.http(
        kIsWeb ? 'localhost:8080' : '10.0.2.2:8080',
        '/services/$serviceId');
    final response = await http.get(url, headers: {'token': widget.token});
    // print('Service Data : ${response.body}');
    if (response.statusCode == 200) {
      final jsonData = json.decode(response.body);
      final dataList = List<ServiceData>.empty(growable: true);
      dataList.add(ServiceData.fromJson(jsonData));
      setState(() => _isLoading = false);
      return dataList;
    } else {
      setState(() {
        const snackBar =
            SnackBar(content: Text('Service data could not be loaded'));
        ScaffoldMessenger.of(context).showSnackBar(snackBar);
        _isLoading = false;
      });
      return [];
    }
  }

  void _actionForm(data, index) {
    Navigator.push(
        context,
        MaterialPageRoute(
            builder: (context) => DataScheme(
                areaName: widget.areaName,
                areaDescription: widget.areaDescription,
                userData: userData,
                token: widget.token,
                data: data,
                name: data[index]['name'],
                dataType: 'action',
                scheme: widget.scheme,
                index: index)));
  }

  void _reactionForm(data, index) {
    Navigator.push(
        context,
        MaterialPageRoute(
            builder: (context) => DataScheme(
                areaName: widget.areaName,
                areaDescription: widget.areaDescription,
                userData: userData,
                token: widget.token,
                data: data,
                name: data[index]['name'],
                dataType: 'reaction',
                scheme: widget.scheme,
                index: index)));
  }

  @override
  void initState() {
    super.initState();
    userData = widget.userData;
    _fetchData(widget.id).then((value) {
      _response.addAll(value);
    });
  }

  @override
  Widget build(BuildContext context) {
    return _isLoading
        ? const LoadingScreen()
        : Scaffold(
            resizeToAvoidBottomInset: false,
            backgroundColor: Colors.transparent,
            appBar: AppBar(
              backgroundColor: Colors.white,
              centerTitle: true,
              automaticallyImplyLeading: false,
              shadowColor: Theme.of(context).colorScheme.shadow,
              title: GradientText(
                widget.name +
                    (widget.type == 'actions' ? ' actions' : ' reactions'),
                gradient: themedGradient,
                style:
                    const TextStyle(fontWeight: FontWeight.bold, fontSize: 24),
              ),
            ),
            body: Container(
              decoration: const BoxDecoration(gradient: themedGradient),
              child: ListView(
                children: <Widget>[
                  GridView.builder(
                    physics: const NeverScrollableScrollPhysics(),
                    shrinkWrap: true,
                    itemCount: 1,
                    gridDelegate:
                        const SliverGridDelegateWithFixedCrossAxisCount(
                            crossAxisCount: 1),
                    itemBuilder: (context, indexAction) {
                      return Container(
                        margin: const EdgeInsets.all(30),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(30),
                        ),
                        child: ListView.builder(
                          shrinkWrap: true,
                          itemCount: widget.type == 'actions'
                              ? _response[0].actions.length
                              : _response[0].reactions.length,
                          itemBuilder: ((context, index) {
                            return Container(
                              margin: const EdgeInsets.all(5.0),
                              child: MyElevatedButton(
                                  gradient: themedGradient,
                                  borderRadius: BorderRadius.circular(30),
                                  onPressed: () {
                                    widget.type == 'actions'
                                        ? _actionForm(
                                            _response[0].actions, index)
                                        : _reactionForm(
                                            _response[0].reactions, index);
                                  },
                                  child: widget.type == 'actions'
                                      ? Text(
                                          _response[0].actions[index]['name'])
                                      : Text(_response[0].reactions[index]
                                          ['name'])),
                            );
                          }),
                        ),
                      );
                    },
                  ),
                ],
              ),
            ),
          );
  }
}
